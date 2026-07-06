from fastapi import APIRouter, HTTPException
from backend.app.database.json_db import read_db, save_to_db

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/login")
def login(datos: dict):
    """Valida usuario y contraseña contra db.json"""
    usuario = datos.get("usuario")
    contrasena = datos.get("contrasena")

    credenciales = read_db()["credenciales"]

    for cred in credenciales:
        if usuario in cred["usuario"] and contrasena == cred["password"]:
            return {"ok": True, "mensaje": "Inicio de sesión exitoso"}

    # Si no encontró coincidencia
    raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
