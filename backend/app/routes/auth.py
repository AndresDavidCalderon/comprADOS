from fastapi import APIRouter, HTTPException
from app.database.db import read_db, save_to_db,engine,Base
from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import Session
import bcrypt
import secrets

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

class Token(Base):
    __tablename__ = "tokens"
    id = Column(Integer, primary_key=True,autoincrement=True)
    token = Column(String, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "token": self.token
        }

@router.post("/login")
def login(datos: dict):
    """Valida usuario y contraseña contra la base de datos"""
    with Session(engine) as session:
        user = datos.get("username")
        password_hash = datos.get("password")

        if not user or not password_hash:
            raise HTTPException(status_code=400, detail="Usuario y contraseña son requeridos.")

        credential = session.query(Credential).filter(Credential.username == user).first()

        if credential and bcrypt.checkpw(password_hash.encode('utf-8'), credential.password_hash.encode('utf-8')):
            token = secrets.token_bytes(32)
            token_obj = Token(token=token.hex())
            session.add(token_obj)
            session.commit()
            return {"message": "Login exitoso", "token": token.hex()}

        else:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos.")

def verifyToken(token: str):
    """Verifica si el token existe en la base de datos"""
    with Session(engine) as session:
        token_obj = session.query(Token).filter(Token.token == token).first()
        return token_obj is not None
