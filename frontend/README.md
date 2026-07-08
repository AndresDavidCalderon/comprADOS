# MeGusta Joyería - Frontend

Interfaz de usuario moderna construida con **React** y **Vite**.

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar en desarrollo
```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

### 3. Construir para producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── navbar/          # Barra de navegación
│   ├── collares/        # Página de collares
│   ├── manillas/        # Página de manillas
│   ├── aretes/          # Página de aretes
│   ├── login/           # Modal de login/registro
│   └── cart/            # Carrito de compras
├── App.jsx              # Componente principal
├── App.css              # Estilos globales
└── main.jsx             # Punto de entrada
```

## 🎨 Componentes Principales

### Navbar
- Logo "MeGusta" ✨
- Navegación entre categorías
- Icono de usuario (abre login)
- Carrito con contador

### Categorías
- **Collares** - Joyería para el cuello
- **Manillas** - Pulseras y brazaletes
- **Aretes** - Pendientes elegantes

Cada página muestra:
- Grid de productos
- Nombre, descripción y precio
- Botón "Agregar al carrito"

### Login Modal
- ✅ Registro de nuevos usuarios
- ✅ Iniciar sesión existente
- ✅ Login con Google/Facebook
- ✅ Validación de formularios

## 🔗 Conexión con Backend

El frontend está configurado para conectar con el backend FastAPI en `http://localhost:8000`

**Endpoints usados:**
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `GET /productos/` - Obtener productos
- `GET /productos/?categoria=...` - Filtrar por categoría
- `GET /carrito/` - Ver carrito
- `POST /carrito/agregar` - Agregar al carrito

## 🎯 Funcionalidades

✅ Navegación fluida entre páginas  
✅ Productos dinámicos por categoría  
✅ Modal de login/registro  
✅ Carrito visual  
✅ Diseño responsive (móvil, tablet, desktop)  
✅ Animaciones suaves  

## 🛠️ Tecnologías

- **React 18** - Librería UI
- **Vite** - Bundler y dev server
- **CSS3** - Estilos modernos
- **Fetch API** - Comunicación con backend

## 📱 Responsive Design

Optimizado para:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1200px+)

## 🚦 Scripts disponibles

```bash
npm run dev       # Iniciar servidor de desarrollo
npm run build     # Crear versión de producción
npm run preview   # Vista previa de build
npm run lint      # Ejecutar ESLint
```

## ⚡ Performance

- Vite proporciona HMR (Hot Module Replacement)
- Code splitting automático
- Optimización de assets

## 📖 Para más información

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [README Principal](../README.md)
