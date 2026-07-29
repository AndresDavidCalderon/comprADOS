# 🛍️ ADOS_MeGusta

> **Proyecto Universitario** — Tienda virtual *MeGusta* (Monorepo: Frontend + Backend)

Un README estructurado y estilizado para guiar la configuración local del entorno de desarrollo.

---

## 📋 Requisitos Previos

Antes de empezar, asegúrate de contar con los siguientes componentes instalados:

* 🟢 **Node.js**: `v16+` *(Recomendado para el Frontend)*
* 🐍 **Python**: `v3.10+` *(Para el Backend)*
* 📦 **pip**: Gestor de paquetes de Python

---

## 🚀 Guía de Instalación y Ejecución Local

### ⚙️ Backend (FastAPI + Uvicorn)

1. **Abre una terminal en la carpeta del backend:**
   ```bash
   cd backend
   ```

2. **Instala las dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Ejecuta la API:**
   ```bash
   cd ..
   python -m backend.main
   ```

📌 **Puntos de acceso del Backend:**
* 🌐 **API:** [http://localhost:8000](http://localhost:8000)
* 📄 **Documentación Automática (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 💻 Frontend (Vite)

1. **Abre una terminal en la carpeta del frontend:**
   ```bash
   cd frontend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

📌 **Punto de acceso del Frontend:**
* 🌐 **Aplicación:** [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Stack Tecnológico

| Módulo | Tecnologías Principal |
| :--- | :--- |
| **Frontend** | Node.js, Vite |
| **Backend** | Python, FastAPI, Uvicorn |
