from fastapi import APIRouter
from app.database.json_db import read_db, save_to_db

router = APIRouter(
    prefix="/productos",
    tags=["productos"]
)

@router.get("/")
def get_productos():
    """Endpoint para obtener todos los productos"""
    return read_db()["productos"]

