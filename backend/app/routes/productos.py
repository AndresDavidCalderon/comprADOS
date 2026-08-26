from fastapi import APIRouter, UploadFile, HTTPException
from rapidfuzz import process, fuzz,utils
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv
import os
from sqlalchemy.orm import Session,Mapped
from sqlalchemy import Column, Integer, String, Float, Boolean, ARRAY
from backend.app.database.db import read_db, save_to_db,Base, engine
from .auth import verifyToken
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
    id = Column(Integer, primary_key=True,autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    size = Column(String, nullable=False)
    materials = Column(ARRAY(String), nullable=True)
    is_hidden = Column(Boolean, nullable=False, default=False)
    quantity = Column(Integer, nullable=False, default=0)
    photos = Column(ARRAY(String), nullable=True)  
    tags = Column(ARRAY(String), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "category": self.category,
            "size": self.size,
            "materials": self.materials,
            "is_hidden": self.is_hidden,
            "quantity": self.quantity,
            "photos": self.photos,
            "tags": self.tags
        }



#----- Endpoints -----#

@router.get("/")
def get_productos():
    with Session(engine) as session:
        productos = session.query(Product).all()
        """Endpoint para obtener todos los productos"""
        return [producto.to_dict() for producto in productos]

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
def create_producto(body: dict):
    if not verifyToken(body["token"]):
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    with Session(engine) as session:
        nuevo_producto = Product(
            name=body["producto"]["name"],
            description=body["producto"]["description"],
            price=body["producto"]["price"],
            category=body["producto"]["category"],
            size=getattr(body["producto"], "size", None),
            materials=body["producto"].get("materials", []),
            is_hidden=body["producto"].get("is_hidden", False),
            quantity=body["producto"].get("quantity", 0),
            photos=body["producto"].get("photos", []),
            tags = body["producto"].get("tags", [])
        )
        session.add(nuevo_producto)
        session.commit()
        session.refresh(nuevo_producto)
    return nuevo_producto

@router.patch("/{producto_id}")
def update_producto(producto_id: int,body:dict):
    if not verifyToken(body["token"]):
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    """Endpoint para actualizar un producto por su ID"""
    with Session(engine) as session:
        producto = session.query(Product).filter(Product.id == producto_id).first()
        if not producto:
            return {"error": "Producto no encontrado"}
        
        for key, value in body["producto"].items():
            if hasattr(producto, key):
                setattr(producto, key, value)
        
        session.commit()
        session.refresh(producto)
    return producto.to_dict()

@router.delete("/{producto_id}")
def delete_producto(producto_id: int, body: dict):
    if not verifyToken(body["token"]):
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
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
    productos = get_productos()
    resultados = [producto for producto in productos if producto.get("category","") == categoria]
    return resultados

@router.get("/search")
def search_productos(query: str):
    with Session(engine) as session:
        productos = session.query(Product).all()
        buscables = [f"{producto.name} {producto.description} {producto.category} {' '.join(producto.tags or [])} {i}" for i, producto in enumerate(productos)]
        rank = process.extract(query, buscables, limit=15, scorer=fuzz.WRatio, processor=utils.default_process)
        rank.sort(key=lambda x: x[1], reverse=True)
        def isAcceptableByToken(result):
            return fuzz.partial_ratio(query, result[0]) > 50
        rank = list(filter(isAcceptableByToken, rank))
        return [productos[int(x[2])].to_dict() for x in rank]