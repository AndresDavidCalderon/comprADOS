from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import backend.app.routes.productos
import backend.app.routes.carrito
import backend.app.routes.auth
import backend.app.routes.ordenes
import backend.app.routes.reviews

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
app.include_router(backend.app.routes.productos.router)
app.include_router(backend.app.routes.carrito.router)
app.include_router(backend.app.routes.auth.router)
app.include_router(backend.app.routes.ordenes.router)
app.include_router(backend.app.routes.reviews.router)


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
