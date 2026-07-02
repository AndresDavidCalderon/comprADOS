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
def upload_temporary_image(files :list[UploadFile]):
    """Endpoint para subir una imagen temporal a Cloudinary"""
    urls = []
    for file in files:
        result = cloudinary.uploader.upload(file.file, folder="productos/temporal")
        urls.append(result["secure_url"])
    return {"urls": urls}

@router.post("/")
def create_producto(producto: dict):
    """Endpoint para crear un nuevo producto"""
    if "id" not in producto:
        producto["id"] = len(read_db()["productos"]) + 1  # Asignar un ID único
    db = read_db()
    db["productos"].append(producto)
    
    save_to_db(db)
    return {"message": "Producto creado exitosamente"}

@router.get("/etiquetas")
def get_etiquetas():
    """Endpoint para obtener todas las etiquetas existentes"""
    return read_db()["etiquetas-existentes"]
