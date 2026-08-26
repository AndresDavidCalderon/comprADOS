from fastapi import APIRouter, HTTPException
from backend.app.database.db import read_db, save_to_db,engine,Base
from sqlalchemy import Column, String
from sqlalchemy.orm import Session
import bcrypt

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

class Credential(Base):
    __tablename__ = "credentials"
    username = Column(String(120), primary_key=True)
    password_hash = Column(String, nullable=False)

    def to_dict(self):
        return {
            "username": self.username,
            "password_hash": self.password_hash
        }

@router.post("/login")
def login(datos: dict):
    """Valida usuario y contraseña contra la base de datos"""
    with Session(engine) as session:
        user = datos.get("user")
        password_hash = datos.get("password")

        if not user or not password_hash:
            raise HTTPException(status_code=400, detail="Usuario y contraseña son requeridos.")

        credential = session.query(Credential).filter(Credential.username == user).first()

        if credential and bcrypt.checkpw(password_hash.encode('utf-8'), credential.password_hash.encode('utf-8')):
            return {"message": "Login exitoso"}
        else:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos.")