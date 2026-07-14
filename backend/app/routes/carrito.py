from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from backend.app.database.json_db import read_db, save_to_db

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
    producto_id: int
    cantidad: int


class CheckoutRequest(BaseModel):
    cliente: Cliente
    items: List[Item]
    total: Optional[float] = None


@router.post("/checkout")
def checkout(payload: CheckoutRequest):
    """Registrar un pedido provisional con los datos del cliente.

    - Valida los campos básicos usando Pydantic.
    - Guarda el pedido en `db.json` bajo la clave `pedidos` (se crea si no existe).
    - Devuelve un resumen de la dirección para que el frontend lo confirme.
    """
    cliente = payload.cliente.dict()
    items = [item.dict() for item in payload.items]
    db = read_db()

    productos_por_id = {producto["id"]: producto for producto in db.get("productos", [])}
    total_calculado = 0
    items_con_precio = []

    for item in items:
        producto = productos_por_id.get(item["producto_id"])
        precio = float(producto.get("price", 0)) if producto else 0
        cantidad = int(item.get("cantidad", 0))

        # Descontar del inventario
        producto["quantity"] -= cantidad

        # Si se agotó, ocultarlo
        if producto["quantity"] <= 0:
            producto["quantity"] = 0
            producto["oculto"] = True

        total_calculado += precio * cantidad
        items_con_precio.append({
            **item,
            "precio_unitario": precio,
            "subtotal": precio * cantidad,
        })

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
