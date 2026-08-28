from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.database.db import save_to_db, read_db, engine, Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import Session


router = APIRouter(
    prefix="/reviews",
    tags=["reviews"]
)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, nullable=False)
    stars = Column(Integer, nullable=False)
    comment = Column(String, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "stars": self.stars,
            "comment": self.comment
        }


# Modelo que valida lo que llega desde el frontend al crear una reseña.
# - stars: debe estar entre 1 y 5 (ge = mayor o igual, le = menor o igual)
# - comment: texto obligatorio de hasta 500 caracteres
class ReviewEntrante(BaseModel):
    stars: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=1, max_length=500)


@router.get("/{producto_id}")
def get_reviews(producto_id: int):
    """Devuelve todas las reseñas de un producto (lista vacía si no tiene)."""
    with Session(engine) as session:
        reviews = session.query(Review).filter(Review.product_id == producto_id).all()
        return [review.to_dict() for review in reviews]


@router.post("/{producto_id}")
def create_review(producto_id: int, review: ReviewEntrante):
    """Crea una nueva reseña (estrellas + comentario) para un producto."""
    with Session(engine) as session:
        nueva_review = Review(product_id=producto_id, stars=review.stars, comment=review.comment)
        session.add(nueva_review)
        session.commit()
        return nueva_review.to_dict()
