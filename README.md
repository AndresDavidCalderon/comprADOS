# ADOS_MeGusta

Proyecto universitario - tienda MeGusta (frontend + backend)

Este README explica cómo inicializar y probar el frontend y el backend localmente.

Requisitos
- Node.js (v16+ recomendado) para frontend
- Python 3.10+ para backend
- pip para instalar dependencias Python

Backend
1. Abrir una terminal en la carpeta `backend`:

   cd backend

2. Instalar dependencias (se asume que existe `requirements.txt`):

   pip install -r requirements.txt

3. Ejecutar la API (FastAPI/uvicorn):

   cd ..
   python -m backend.main

   - La API quedará disponible en http://localhost:8000
   - Documentación automática en http://localhost:8000/docs

Frontend
1. Abrir una terminal en la carpeta `frontend`:

   cd frontend

2. Instalar dependencias:

   npm install

3. Iniciar servidor de desarrollo (Vite):

   npm run dev

   - La aplicación quedará disponible típicamente en http://localhost:5173

