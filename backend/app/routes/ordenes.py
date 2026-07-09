from fastapi import APIRouter
from backend.app.database.json_db import save_to_db,read_db
router = APIRouter(
    prefix="/ordenes",
)

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
