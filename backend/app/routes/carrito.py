from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.database.db import read_db, save_to_db, engine
from app.routes.productos import Product, ProductVariant
from app.utils.municipios import es_municipio_cercano
from sqlalchemy.orm import Session, selectinload
import os
import stripe
import json

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_xxxxxxxxxx")  # tu key de sandbox
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

router = APIRouter(
    prefix="/carrito",
    tags=["carrito"]
)




class Cliente(BaseModel):
    identificacion: str
    telefono: str
    nombre: str
    departamento: str
    municipio: str
    carrera: str
    calle: str
    detalles_extra: Optional[str] = None


class Item(BaseModel):
    producto_id: Optional[int] = None
    variant_id: Optional[int] = None
    cantidad: int


class CheckoutRequest(BaseModel):
    cliente: Cliente
    items: List[Item]
    total: Optional[float] = None
    metodo_pago: Optional[str] = None

class CrearSesionRequest(BaseModel):
    cliente: Cliente
    items: List[Item]
    total: float

class ConfirmarPagoRequest(BaseModel):
    session_id: str


def _resolve_variant(session, item):
    variant_id = item.get("variant_id")
    if variant_id is not None:
        variant = session.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    else:
        product_id = item.get("producto_id")
        product = session.query(Product).options(selectinload(Product.variants)).filter(Product.id == product_id).first()
        variant = next((candidate for candidate in product.variants if candidate.is_showcase), None) if product else None
        if variant is None and product and product.variants:
            variant = product.variants[0]

    if not variant or not variant.product or variant.product.is_hidden:
        raise HTTPException(status_code=400, detail="La variante seleccionada ya no está disponible.")
    return variant


def _variant_price(variant):
    return float(variant.price_override if variant.price_override is not None else variant.product.price)


def _validate_quantity(variant, quantity):
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="La cantidad debe ser mayor que cero.")
    if quantity > variant.quantity:
        raise HTTPException(status_code=400, detail="No hay suficientes unidades disponibles de esta variante.")


def _item_data(item):
    return item.model_dump() if isinstance(item, Item) else item

@router.post("/create-checkout-session")
def create_checkout_session(payload: CrearSesionRequest):
    """Crear sesión de pago de Stripe en modo sandbox."""
    try:
        items = [_item_data(item) for item in payload.items]
        line_items = []
        total = 0
        with Session(engine) as db_session:
            for item in items:
                variant = _resolve_variant(db_session, item)
                quantity = int(item.get("cantidad", 0))
                _validate_quantity(variant, quantity)
                price = _variant_price(variant)
                total += price * quantity
                line_items.append({
                    "price_data": {
                        "currency": "cop",
                        "product_data": {"name": f"{variant.product.name} - {variant.variant_type}"},
                        "unit_amount": int(price * 100),
                    },
                    "quantity": quantity,
                })

        # Guardar temporalmente los datos del pedido en metadata
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{FRONTEND_URL}/?payment=success&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/?payment=cancel",
            metadata={
                "cliente_nombre": payload.cliente.nombre,
                "cliente_identificacion": payload.cliente.identificacion,
                "cliente_telefono": payload.cliente.telefono,
                "cliente_departamento": payload.cliente.departamento,
                "cliente_municipio": payload.cliente.municipio,
                "cliente_carrera": payload.cliente.carrera,
                "cliente_calle": payload.cliente.calle,
                "cliente_detalles_extra": payload.cliente.detalles_extra or "",
                "items_json": json.dumps(items),
                "total": str(total),
            },
        )

        db = read_db()
        if "pagos_pendientes" not in db:
            db["pagos_pendientes"] = {}

        db["pagos_pendientes"][session.id] = {
            "cliente": payload.cliente.dict(),
            "items": items,
            "total": total,
        }
        save_to_db(db)

        return {"url": session.url}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/confirmar-pago")
def confirmar_pago(payload: ConfirmarPagoRequest):
    """Verifica la sesión de Stripe y crea el pedido."""
    try:
        session = stripe.checkout.Session.retrieve(payload.session_id)

        if session.payment_status != "paid":
            raise HTTPException(status_code=400, detail="El pago no se ha completado")

        db = read_db()
        # Verificar si la orden ya fue creada previamente para este session_id
        pedidos_existentes = db.get("pedidos", [])
        pedido_existente = next((p for p in pedidos_existentes if p.get("stripe_session_id") == payload.session_id), None)
        if pedido_existente:
            return {
                "pedido_id": pedido_existente["id"],
                "direccion_resumen": pedido_existente.get("direccion_resumen", ""),
                "total": pedido_existente.get("total", 0),
            }

        pendiente = db.get("pagos_pendientes", {}).get(payload.session_id)
        if pendiente:
            cliente = pendiente["cliente"]
            items = pendiente["items"]
            total_pendiente = pendiente.get("total")
        else:
            metadata = dict(getattr(session, "metadata", {}) or {})
            items = json.loads(metadata.get("items_json", "[]"))
            cliente = {
                "identificacion": metadata.get("cliente_identificacion"),
                "telefono": metadata.get("cliente_telefono"),
                "nombre": metadata.get("cliente_nombre"),
                "departamento": metadata.get("cliente_departamento"),
                "municipio": metadata.get("cliente_municipio"),
                "carrera": metadata.get("cliente_carrera"),
                "calle": metadata.get("cliente_calle"),
                "detalles_extra": metadata.get("cliente_detalles_extra"),
            }
            total_pendiente = float(metadata.get("total", 0) or 0)

        total_calculado = 0
        items_con_precio = []
        with Session(engine) as db_session:
            for item in items:
                variant = _resolve_variant(db_session, item)
                cantidad = int(item.get("cantidad", 0))
                _validate_quantity(variant, cantidad)
                precio = _variant_price(variant)
                variant.quantity -= cantidad
                total_calculado += precio * cantidad
                items_con_precio.append({
                    **item,
                    "producto_nombre": variant.product.name,
                    "variant_type": variant.variant_type,
                    "precio_unitario": precio,
                    "subtotal": precio * cantidad,
                })
            db_session.commit()

        if "pedidos" not in db:
            db["pedidos"] = []

        pedido_id = len(db["pedidos"]) + 1

        direccion_parts = [
            cliente.get("departamento", ""),
            cliente.get("municipio", ""),
            cliente.get("carrera", ""),
            cliente.get("calle", ""),
        ]
        direccion = ", ".join([p for p in direccion_parts if p])
        if cliente.get("detalles_extra"):
            direccion = f"{direccion} ({cliente.get('detalles_extra')})"

        pedido = {
            "id": pedido_id,
            "cliente": cliente,
            "items": items_con_precio,
            "total": total_calculado if total_calculado > 0 else total_pendiente,
            "direccion_resumen": direccion,
            "metodo_pago": "tarjeta",
            "stripe_session_id": payload.session_id,
            "created_at": datetime.utcnow().isoformat(),
        }

        db["pedidos"].append(pedido)
        if "pagos_pendientes" in db and payload.session_id in db["pagos_pendientes"]:
            del db["pagos_pendientes"][payload.session_id]
        save_to_db(db)

        return {
            "pedido_id": pedido_id,
            "direccion_resumen": direccion,
            "total": total_calculado,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/validar-municipio/{municipio}")
def validar_municipio(municipio: str, departamento: Optional[str] = None):
    """Valida si un municipio es cercano o lejano."""
    cercano = es_municipio_cercano(municipio, departamento)
    return {
        "municipio": municipio,
        "departamento": departamento,
        "tipo": "cercano" if cercano else "lejano",
        "permite_contra_entrega": cercano
    }


@router.post("/checkout")
def checkout(payload: CheckoutRequest):
    """Registrar un pedido provisional con los datos del cliente.

    - Valida los campos básicos usando Pydantic.
    - Valida que el pago contra entrega solo sea permitido en municipios cercanos de Antioquia.
    - Guarda el pedido en `db.json` bajo la clave `pedidos` (se crea si no existe).
    - Devuelve un resumen de la dirección para que el frontend lo confirme.
    """
    cliente = payload.cliente.dict()
    es_cercano = es_municipio_cercano(cliente.get("municipio", ""), cliente.get("departamento", ""))

    if payload.metodo_pago == "efectivo" and not es_cercano:
        raise HTTPException(
            status_code=400,
            detail="El pago contra entrega solo está disponible para municipios cercanos en el departamento de Antioquia (Bello, Medellín, Itagüí, Envigado)."
        )

    items = [_item_data(item) for item in payload.items]
    db = read_db()

    total_calculado = 0
    items_con_precio = []
    with Session(engine) as db_session:
        for item in items:
            variant = _resolve_variant(db_session, item)
            cantidad = int(item.get("cantidad", 0))
            _validate_quantity(variant, cantidad)
            precio = _variant_price(variant)
            variant.quantity -= cantidad
            total_calculado += precio * cantidad
            items_con_precio.append({
                **item,
                "producto_nombre": variant.product.name,
                "variant_type": variant.variant_type,
                "precio_unitario": precio,
                "subtotal": precio * cantidad,
            })
        db_session.commit()

    if "pedidos" not in db:
        db["pedidos"] = []

    pedido_id = len(db["pedidos"]) + 1
    timestamp = datetime.utcnow().isoformat()

    direccion_parts = [
        cliente.get("departamento", ""),
        cliente.get("municipio", ""),
        cliente.get("carrera", ""),
        cliente.get("calle", "")
    ]
    direccion = ", ".join([p for p in direccion_parts if p])
    if cliente.get("detalles_extra"):
        direccion = f"{direccion} (Detalles: {cliente.get('detalles_extra')})"

    pedido = {
        "id": pedido_id,
        "cliente": cliente,
        "items": items_con_precio,
        "total": total_calculado if total_calculado > 0 else payload.total,
        "direccion_resumen": direccion,
        "metodo_pago": payload.metodo_pago,
        "tipo_municipio": "cercano" if es_cercano else "lejano",
        "created_at": timestamp
    }

    db["pedidos"].append(pedido)
    save_to_db(db)

    return {
        "message": "Pedido registrado (borrador)",
        "pedido_id": pedido_id,
        "direccion_resumen": direccion,
        "total": pedido["total"],
        "cliente": {"nombre": cliente.get("nombre"), "telefono": cliente.get("telefono"), "identificacion": cliente.get("identificacion")},
        "items": items_con_precio
    }
