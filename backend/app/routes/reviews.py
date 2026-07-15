from fastapi import APIRouter
from backend.app.database.json_db import save_to_db,read_db

router = APIRouter(
    prefix="/reviews",
)