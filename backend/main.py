from fastapi import FastAPI
from sqlalchemy import create_engine,engine
from sqlalchemy.orm import DeclarativeBase
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, carrito, ordenes, productos, reviews
from dotenv import load_dotenv


load_dotenv()
# Crear motor de base de datos

# Crear aplicación FastAPI
app = FastAPI(
    title="MeGusta Joyería API",
    description="API para tienda de joyería",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(productos.router)
app.include_router(carrito.router)
app.include_router(auth.router)
app.include_router(ordenes.router)
app.include_router(reviews.router)


@app.get("/")
def root():
    """Endpoint raíz"""
    return {
        "mensaje": "Bienvenido a MeGusta Joyería API",
        "version": "1.0.0",
        "documentacion": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
