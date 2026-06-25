from fastapi import APIRouter, UploadFile, File
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv
import os
from backend.app.database.json_db import read_db, save_to_db

load_dotenv()  # Load environment variables from .env file

# Configuration       
cloudinary.config( 
    cloud_name = "ddb1yiioo", 
    api_key = "668374212469359", 
    api_secret = os.getenv("API_SECRET"), # Se que la seguridad no es la prioridad, pero para conseguir esta clave,
    # escribanme a whatsapp para que la puedan poner en el .env. es mamón pero el repo es público creo.
    secure=True
)

router = APIRouter(
    prefix="/productos",
    tags=["productos"]
)

@router.get("/")
def get_productos():
    """Endpoint para obtener todos los productos"""
    return read_db()["productos"]

# Las imagenes son primero subidas "temporalmente", huerfanas, y luego se asocian a un producto cuando este es creado.
@router.post("/imagenes/temporales")
def upload_temporary_image(file :UploadFile):
    """Endpoint para subir una imagen temporal a Cloudinary"""
    result = cloudinary.uploader.upload(file.file, folder="productos/temporal")
    return {"url": result["secure_url"]}