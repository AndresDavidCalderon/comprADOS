from fastapi import APIRouter, UploadFile, File
from rapidfuzz import process, fuzz,utils
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv
import os
from sqlalchemy.orm import Session,Mapped
from sqlalchemy import Column, Integer, String, Float, Boolean
from backend.app.database.db import read_db, save_to_db,Base, engine
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

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    size = Column(String, nullable=False)
    materials = Column(String, nullable=False)
    is_hidden = Column(Boolean, nullable=False, default=False)


#----- Endpoints -----#

@router.get("/")
def get_productos():
    with Session(engine) as session:
        productos = session.query(Product).all()
    """Endpoint para obtener todos los productos"""
    return productos

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
        producto["id"] = read_db()["ultimoProductoId"] + 1  # Asignar un ID único
        save_to_db({**read_db(), "ultimoProductoId": producto["id"]})
    else:
        # Verificar si el ID ya existe
        existing_productos = read_db()["productos"]
        if any(p["id"] == producto["id"] for p in existing_productos):
            return {"error": "El ID del producto ya existe. Por favor, elija un ID único o no lo incluya."}
    
    db = read_db()
    db["productos"].append(producto)
    
    save_to_db(db)
    return {"message": "Producto creado exitosamente"}

@router.patch("/{producto_id}")
def update_producto(producto_id: int, producto_actualizado: dict):
    """Endpoint para actualizar un producto por su ID"""
    db = read_db()
    productos = db["productos"]
    for i, p in enumerate(productos):
        if p["id"] == producto_id:
            productos[i] = {**p, **producto_actualizado}
            save_to_db(db)
            return {"message": "Producto actualizado exitosamente"}
    return {"error": "Producto no encontrado"}

@router.delete("/{producto_id}")
def delete_producto(producto_id: int):
    """Endpoint para eliminar un producto por su ID"""
    db = read_db()
    productos = db["productos"]
    producto_a_eliminar = next((p for p in productos if p["id"] == producto_id), None)
    
    if producto_a_eliminar:
        productos.remove(producto_a_eliminar)
        save_to_db(db)
        return {"message": "Producto eliminado exitosamente"}
    else:
        return {"error": "Producto no encontrado"}

@router.get("/etiquetas")
def get_etiquetas():
    """Endpoint para obtener todas las etiquetas existentes"""
    return read_db()["etiquetas-existentes"]

@router.get("/listaProductos")
def get_producto(ids: list[int]):
    """Endpoint para obtener un producto por su ID"""
    productos = read_db()["productos"]
    resultados=[]
    for id in ids:
        for producto in productos:
            if producto["id"] == id:
                resultados.append(producto)
    return resultados

@router.get("/categorias/{categoria}")
def get_productos_por_categoria(categoria: str):
    """Endpoint para obtener productos por categoría"""
    productos = read_db()["productos"]
    resultados = [producto for producto in productos if producto["category"] == categoria]
    return resultados

@router.get("/search")
def search_productos(query: str):
    query = query.lower()
    productos = read_db()["productos"]
    buscables = [f"{producto['name']} {producto['description']} {producto['category']} {producto['tags']} {i}" for i, producto in enumerate(productos)]
    rank=process.extract(query, buscables, limit=15, scorer=fuzz.WRatio, processor=utils.default_process)
    rank.sort(key=lambda x: x[1], reverse=True)
    def isAcceptableByToken(result):
        return fuzz.partial_ratio(query, result[0]) > 50
    rank = list(filter(isAcceptableByToken, rank))
    print(rank)
    return list(map(lambda x: productos[int(x[2])], rank))