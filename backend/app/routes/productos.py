from fastapi import APIRouter, UploadFile, HTTPException
from rapidfuzz import process, fuzz,utils
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv
import os
import re
from sqlalchemy.orm import Session, relationship, selectinload
from sqlalchemy import Column, BigInteger, Integer, String, Boolean, ARRAY, ForeignKey, Numeric
from app.database.db import read_db, save_to_db,Base, engine
from .auth import verifyToken
load_dotenv()  # Load environment variables from .env file



# Configuration       
cloudinary.config( 
    cloud_name = "oltirrkj", 
    api_key = "168195489512692", 
    api_secret = os.getenv("CLOUDINARY_API_SECRET"), # Se que la seguridad no es la prioridad, pero para conseguir esta clave,
    # escribanme a whatsapp para que la puedan poner en el .env. es mamón pero el repo es público creo.
    secure=True
)

router = APIRouter(
    prefix="/productos",
    tags=["productos"]
)

class Product(Base):
    __tablename__ = "products"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    category = Column(String, nullable=False)
    variant_kind = Column(String, nullable=True)
    materials = Column(ARRAY(String), nullable=True)
    is_hidden = Column(Boolean, nullable=False, default=False)
    tags = Column(ARRAY(String), nullable=True)
    variants = relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="ProductVariant.id",
    )

    def to_dict(self):
        variants = [variant.to_dict(self) for variant in self.variants]
        showcase_variant = next((variant for variant in variants if variant["is_showcase"]), None)
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": float(self.price),
            "category": self.category,
            "variant_kind": self.variant_kind,
            "materials": self.materials or [],
            "is_hidden": self.is_hidden,
            "quantity": sum(variant["quantity"] for variant in variants),
            "photos": showcase_variant["photos"] if showcase_variant else [],
            "tags": self.tags or [],
            "variants": variants,
            "showcase_variant": showcase_variant,
        }

class Tag(Base):
    __tablename__ = "tags"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    variant_type = Column(String, nullable=False, default="Unica")
    quantity = Column(Integer, nullable=False, default=0)
    quantity_override = Column(Boolean, nullable=False, default=True)
    photos = Column(ARRAY(String), nullable=False, default=list)
    description_override = Column(String, nullable=True)
    price_override = Column(Numeric(12, 2), nullable=True)
    materials_override = Column(ARRAY(String), nullable=True)
    is_showcase = Column(Boolean, nullable=False, default=False)
    product = relationship("Product", back_populates="variants")

    def to_dict(self, product=None):
        product = product or self.product
        return {
            "id": self.id,
            "product_id": self.product_id,
            "variant_type": self.variant_type,
            "quantity": self.quantity,
            "quantity_override": self.quantity_override,
            "photos": self.photos or [],
            "description_override": self.description_override,
            "price_override": float(self.price_override) if self.price_override is not None else None,
            "materials_override": self.materials_override,
            "description": self.description_override if self.description_override is not None else product.description,
            "price": float(self.price_override if self.price_override is not None else product.price),
            "materials": self.materials_override if self.materials_override is not None else (product.materials or []),
            "is_showcase": self.is_showcase,
        }


def _normalized_variants(variants):
    if not isinstance(variants, list) or not variants:
        raise HTTPException(status_code=400, detail="El producto debe tener al menos una variante.")
    if sum(bool(variant.get("is_showcase")) for variant in variants) > 1:
        raise HTTPException(status_code=400, detail="Solo puede haber una variante de escaparate.")

    normalized = []
    has_showcase = any(bool(variant.get("is_showcase")) for variant in variants)
    for index, variant in enumerate(variants):
        quantity = int(variant.get("quantity", 0))
        if quantity < 0:
            raise HTTPException(status_code=400, detail="La cantidad de una variante no puede ser negativa.")
        normalized.append({
            **variant,
            "variant_type": (variant.get("variant_type") or "Unica").strip(),
            "quantity": quantity,
            "quantity_override": bool(variant.get("quantity_override", True)),
            "photos": variant.get("photos") or [],
            "is_showcase": bool(variant.get("is_showcase")) or (not has_showcase and index == 0),
        })
    return normalized


def _normalized_variant_kind(variant_kind, variants):
    if len(variants) < 2:
        return None
    if variant_kind in ("color", "name"):
        normalized_kind = variant_kind
    else:
        first_variant_type = variants[0].get("variant_type", "")
        normalized_kind = "color" if re.fullmatch(r"#[0-9a-fA-F]{6}", first_variant_type) else "name"

    if normalized_kind == "color" and any(
        not re.fullmatch(r"#[0-9a-fA-F]{6}", variant["variant_type"])
        for variant in variants
    ):
        raise HTTPException(status_code=400, detail="Todas las variantes deben usar un color válido.")
    return normalized_kind


def _new_variant(data):
    return ProductVariant(
        variant_type=data["variant_type"],
        quantity=data["quantity"],
        quantity_override=data["quantity_override"],
        photos=data["photos"],
        description_override=data.get("description_override"),
        price_override=data.get("price_override"),
        materials_override=data.get("materials_override"),
        is_showcase=data["is_showcase"],
    )

def insert_tags(tag_list):
    with Session(engine) as session:
        for tag_name in tag_list:
            existing_tag = session.query(Tag).filter(Tag.name == tag_name).first()
            if not existing_tag:
                new_tag = Tag(name=tag_name)
                session.add(new_tag)
        session.commit()

#----- Endpoints -----#

@router.get("/")
def get_productos():
    with Session(engine) as session:
        productos = session.query(Product).options(selectinload(Product.variants)).all()
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
    if not verifyToken(body.get("token")):
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    product_data = body.get("producto") or {}
    variant_data = product_data.get("variants")
    if variant_data is None:
        variant_data = [{
            "variant_type": "Unica",
            "quantity": product_data.get("quantity", 0),
            "photos": product_data.get("photos", []),
            "is_showcase": True,
        }]
    variant_data = _normalized_variants(variant_data)
    variant_kind = _normalized_variant_kind(product_data.get("variant_kind"), variant_data)

    with Session(engine) as session:
        nuevo_producto = Product(
            name=product_data["name"],
            description=product_data["description"],
            price=product_data["price"],
            category=product_data["category"],
            variant_kind=variant_kind,
            materials=product_data.get("materials", []),
            is_hidden=product_data.get("is_hidden", False),
            tags=product_data.get("tags", []),
        )
        insert_tags(nuevo_producto.tags)
        nuevo_producto.variants = [_new_variant(variant) for variant in variant_data]
        session.add(nuevo_producto)
        session.commit()
        session.refresh(nuevo_producto)
        return nuevo_producto.to_dict()

@router.patch("/{producto_id}")
def update_producto(producto_id: int,body:dict):
    if not verifyToken(body.get("token")):
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    """Endpoint para actualizar un producto por su ID"""
    with Session(engine) as session:
        producto = session.query(Product).options(selectinload(Product.variants)).filter(Product.id == producto_id).first()
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado.")

        product_data = body.get("producto") or {}
        for key in ("name", "description", "price", "category", "materials", "is_hidden", "tags"):
            if key in product_data:
                setattr(producto, key, product_data[key])

        if "variants" in product_data:
            variant_data = _normalized_variants(product_data["variants"])
            producto.variant_kind = _normalized_variant_kind(product_data.get("variant_kind"), variant_data)
            existing_variants = {variant.id: variant for variant in producto.variants}
            for variant in producto.variants:
                variant.is_showcase = False
            session.flush()

            retained_ids = set()
            for data in variant_data:
                variant_id = data.get("id")
                variant = existing_variants.get(int(variant_id)) if variant_id is not None else None
                if variant is None:
                    variant = _new_variant(data)
                    variant.product = producto
                    session.add(variant)
                else:
                    retained_ids.add(variant.id)
                    variant.variant_type = data["variant_type"]
                    variant.quantity = data["quantity"]
                    variant.quantity_override = data["quantity_override"]
                    variant.photos = data["photos"]
                    variant.description_override = data.get("description_override")
                    variant.price_override = data.get("price_override")
                    variant.materials_override = data.get("materials_override")
                variant.is_showcase = data["is_showcase"]

            for variant_id, variant in existing_variants.items():
                if variant_id not in retained_ids:
                    session.delete(variant)
        elif "variant_kind" in product_data:
            producto.variant_kind = product_data["variant_kind"]
        elif "quantity" in product_data or "photos" in product_data:
            showcase = next((variant for variant in producto.variants if variant.is_showcase), None)
            if showcase:
                if "quantity" in product_data:
                    showcase.quantity = max(int(product_data["quantity"]), 0)
                if "photos" in product_data:
                    showcase.photos = product_data["photos"] or []
        insert_tags(producto.tags)
        session.commit()
        session.refresh(producto)
        session.expire(producto, ["variants"])
        return producto.to_dict()

@router.delete("/{producto_id}")
def delete_producto(producto_id: int, body: dict):
    if not verifyToken(body.get("token")):
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    """Endpoint para eliminar un producto por su ID"""
    with Session(engine) as session:
        producto = session.query(Product).filter(Product.id == producto_id).first()
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado.")
        session.delete(producto)
        session.commit()
    return {"message": "Producto eliminado exitosamente"}

@router.get("/etiquetas")
def get_etiquetas():
    """Endpoint para obtener todas las etiquetas existentes"""
    with Session(engine) as session:
        etiquetas = session.query(Tag).all()
        return [etiqueta.name for etiqueta in etiquetas]

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
        productos = session.query(Product).options(selectinload(Product.variants)).all()
        buscables = [f"{producto.name} {producto.description} {producto.category} {' '.join(producto.tags or [])} {i}" for i, producto in enumerate(productos)]
        rank = process.extract(query, buscables, limit=15, scorer=fuzz.WRatio, processor=utils.default_process)
        rank.sort(key=lambda x: x[1], reverse=True)
        def isAcceptableByToken(result):
            return fuzz.partial_ratio(query, result[0]) > 50
        rank = list(filter(isAcceptableByToken, rank))
        return [productos[int(x[2])].to_dict() for x in rank]