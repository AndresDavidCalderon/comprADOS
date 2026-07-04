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
        "items": items,
        "direccion_resumen": direccion,
        "created_at": timestamp
    }

    db["pedidos"].append(pedido)
    save_to_db(db)

    return {
        "message": "Pedido registrado (borrador)",
        "pedido_id": pedido_id,
        "direccion_resumen": direccion,
        "cliente": {"nombre": cliente.get("nombre"), "telefono": cliente.get("telefono"), "identificacion": cliente.get("identificacion")},
        "items": items
    }