from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.database.db import save_to_db,read_db
router = APIRouter(
    prefix="/ordenes",
)
    
class EstadoUpdate(BaseModel):
    estado: str

@router.post("/")
def create_order(order_data):
    db = read_db()
    order_id = len(db) + 1
    order_data["id"] = order_id
    db["pedidos"].append(order_data)
    save_to_db(db)
    return {"mensaje": "Orden creada"}

@router.get("/")
def get_orders():
    db = read_db()
    return db["pedidos"]

@router.patch("/{order_id}/estado")
def update_order_estado(order_id: int, payload: EstadoUpdate):
    db = read_db()
    pedidos = db.get("pedidos", [])
    pedido = next((p for p in pedidos if p.get("id") == order_id), None)

    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    pedido["estado"] = payload.estado
    save_to_db(db)

    return pedido
