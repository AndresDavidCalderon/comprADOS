import { useState, useContext } from 'react'
import Navbar from './components/navbar/Navbar'
import Collares from './components/collares/Collares'
import Manillas from './components/manillas/Manillas'
import Aretes from './components/aretes/Aretes'
import Login from './components/login/Login'
import './App.css'
import AdvertsManager from './components/administrador-anuncios/AdvertsManager'
import AuthContext from './context/AuthContext'
import CartDrawer from './components/cart/CartDrawer'
import Checkout from './components/cart/Checkout'
import { productCatalog } from './data/products'
import NotiManager from './components/administrador-notificaciones/NotiManager'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [showLogin, setShowLogin] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantityOnCart: item.quantityOnCart + 1,
              }
            : item,
        )
      }

      return [...prevItems, { ...product, quantityOnCart: 1 }]
    })
    setIsCartOpen(true)
  }

  const incrementQuantity = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item.quantityOnCart < item.quantity) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? {
                ...item,
                quantityOnCart: item.quantityOnCart + 1,
              }
            : item,
      ))
    }
    
  }

  const decrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantityOnCart: Math.max(0, item.quantityOnCart - 1),
              }
            : item,
        )
        .filter((item) => item.quantityOnCart > 0),
    )
  }

  const finalizarCompra = async (datosCliente, metodoPago) => {

  const venta = {
    cliente: datosCliente,
    productos: cartItems,
    metodoPago,
    fecha: new Date().toISOString(),
    total: cartItems.reduce(
      (acc, item) => acc + item.price * item.quantityOnCart,
      0
    )
  };

  console.log("Venta creada:", venta);

    /*
    //Después aquí irá el fetch al backend para el POST de la venta
    //Sería algo así
    await fetch("http://localhost:8000/ventas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(venta)
    });
    */

    setCartItems([]);
    setIsCartOpen(false);
    setCurrentPage('checkout');
    alert("¡Compra realizada con éxito!");
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantityOnCart, 0)
  const auth = useContext(AuthContext)

  if ((!auth.isAuthenticated) && (currentPage === 'adverts' || currentPage === 'notice')) {
    setCurrentPage('home')
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'collares':
        return (
          <Collares
            products={productCatalog.collares.products}
            onAddToCart={addToCart}
            title={productCatalog.collares.title}
            subtitle={productCatalog.collares.subtitle}
            title="Collares"
          />
        )
      case 'manillas':
        return (
          <Manillas
            products={productCatalog.manillas.products}
            onAddToCart={addToCart}
            title={productCatalog.manillas.title}
            subtitle={productCatalog.manillas.subtitle}
            title="Manillas"
          />
        )
      case 'aretes':
        return (
          <Aretes
            title="Aretes"
          />
        )
      case 'checkout':
        return (
          <Checkout
            items={cartItems}
            onSuccess={() => { setCartItems([]); setCurrentPage('home') }}
            onCancel={() => setCurrentPage('home')}
          />
        )
      case 'notice':
        return <NotiManager />
      case 'adverts':
        return <AdvertsManager />
      default:
        return (
          <section className="home">
            <div className="home-hero">
              <h1>Bienvenido a ADOS Me Gusta</h1>
              <p>Descubre nuestras colecciones exclusivas de joyería fina</p>
              <button className="cta-btn" onClick={() => setCurrentPage('collares')}>
                Explorar Ahora
              </button>
            </div>
          </section>
        )
    }
  }

  return (
    <>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onNavigate={setCurrentPage}
        onCartClick={() => setIsCartOpen((prev) => !prev)}
        cartCount={cartCount}
      />
      {renderPage()}
      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onIncrement={incrementQuantity}
        onDecrement={decrementQuantity}
        onCheckout={finalizarCompra}
      />
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default App
