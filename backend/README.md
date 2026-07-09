# MeGusta Joyería - Backend API

API REST construida con **FastAPI** y base de datos **JSON**.

## 🚀 Inicio Rápido

### 1. Crear entorno virtual
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 3. Ejecutar servidor
```bash
python main.py
# o
uvicorn main:app --reload
```

Servidor en: **http://localhost:8000**

## 📚 Documentación Interactiva

Una vez que el servidor esté corriendo:

- **Swagger UI**: http://localhost:8000/docs ⭐ (Recomendado)
- **ReDoc**: http://localhost:8000/redoc

## 📁 Estructura

```
app/
├── routes/              # 🔌 Endpoints de la API
│   ├── auth.py         # Autenticación (login, registro)
│   ├── productos.py    # Gestión de productos
│   └── carrito.py      # Gestión del carrito
├── schemas/             # 📋 Esquemas Pydantic
│   └── schemas.py      # Definiciones de datos
├── database/            # 💾 Gestión de datos
│   └── json_db.py      # Base de datos JSON
└── utils/               # 🛠️ Funciones auxiliares
    └── auth.py         # Hash, tokens, verificación

data/                   # 📊 Archivos JSON
├── usuarios.json       # Usuarios registrados
├── productos.json      # Catálogo de productos
└── carritos.json       # Carritos de compra
```

## 🔌 Endpoints Disponibles

### 🔐 Autenticación

#### Registro
```http
POST /auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "token_1_abc123...",
  "token_type": "bearer",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

#### Obtener Usuario Actual
```http
GET /auth/me?token=token_1_abc123...
```

### 📦 Productos

#### Obtener Todos
```http
GET /productos/
```

#### Filtrar por Categoría
```http
GET /productos/?categoria=collares
GET /productos/?categoria=manillas
GET /productos/?categoria=aretes
```

#### Obtener Producto por ID
```http
GET /productos/1
```

### 🛒 Carrito

#### Ver Carrito
```http
GET /carrito/?token=token_1_abc123...
```

#### Agregar al Carrito
```http
POST /carrito/agregar?token=token_1_abc123...
Content-Type: application/json

{
  "producto_id": 1,
  "cantidad": 2
}
```

#### Remover del Carrito
```http
DELETE /carrito/remover/1?token=token_1_abc123...
```

#### Vaciar Carrito
```http
DELETE /carrito/vaciar?token=token_1_abc123...
```

## 🗄️ Base de Datos (JSON)

Los datos se guardan automáticamente en `data/`:
- **usuarios.json** - Usuarios registrados
- **productos.json** - 6 productos iniciales
- **carritos.json** - Carritos de compra

## 🔐 Autenticación

Sistema simple de tokens:
1. **Registro** → Usuario recibe ID
2. **Login** → Usuario recibe token
3. **Requests** → Envía token en cada request
4. **Validación** → Backend verifica token

## 🛠️ Tecnologías

- **FastAPI** - Framework web
- **Pydantic** - Validación de datos
- **Uvicorn** - Servidor ASGI
- **JSON** - Base de datos
- **Python 3.8+**

## 📖 Para más información

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [README Principal](../README.md)

---

¡Comienza en: http://localhost:8000/docs!
