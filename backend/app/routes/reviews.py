from fastapi import APIRouter
from pydantic import BaseModel, Field
from backend.app.database.json_db import save_to_db, read_db

router = APIRouter(
    prefix="/reviews",
    tags=["reviews"]
)


# Modelo que valida lo que llega desde el frontend al crear una reseña.
# - estrellas: debe estar entre 1 y 5 (ge = mayor o igual, le = menor o igual)
# - comentario: texto obligatorio de hasta 500 caracteres
class ReviewEntrante(BaseModel):
    estrellas: int = Field(..., ge=1, le=5)
    comentario: str = Field(..., min_length=1, max_length=500)


@router.get("/{producto_id}")
def get_reviews(producto_id: int):
    """Devuelve todas las reseñas de un producto (lista vacía si no tiene)."""
    reviews = read_db()["reviews"]
    # En el JSON las claves son texto, por eso convertimos el id a str
    return reviews.get(str(producto_id), [])


@router.post("/{producto_id}")
def create_review(producto_id: int, review: ReviewEntrante):
    """Crea una nueva reseña (estrellas + comentario) para un producto."""
    db = read_db()
    reviews = db["reviews"]

    clave = str(producto_id)
    if clave not in reviews:
        reviews[clave] = []

    # Buscamos el id más alto entre TODAS las reseñas para no repetirlo
    ids_existentes = [r["id"] for lista in reviews.values() for r in lista]
    nuevo_id = max(ids_existentes, default=0) + 1

    nueva_review = {
        "id": nuevo_id,
        "estrellas": review.estrellas,
        "texto": review.comentario,
    }
    reviews[clave].append(nueva_review)

    save_to_db(db)
    return nueva_review
