import { useState, useContext, useEffect, useRef } from 'react'
import Navbar from './components/navbar/Navbar'
import Login from './components/login/Login'
import './App.css'
import AdvertsManager from './components/administrador-anuncios/AdvertsManager'
import AuthContext from './context/AuthContext'
import ApiContext from './context/ApiContext'
import CartDrawer from './components/cart/CartDrawer'
import Checkout from './components/cart/Checkout'
import NotiManager from './components/administrador-notificaciones/NotiManager'
import Detalles from './components/detalles-producto/Detalles'
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton'
import Welcome from './components/welcome/Welcome'
import cartContext from './context/CartContext.jsx'
import Collares from './components/collares/Collares'
import Manillas from './components/manillas/Manillas'
import Aretes from './components/aretes/Aretes'
import { productCatalog } from './data/products'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [showLogin, setShowLogin] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const previousCartAmount = useRef(0)
  const { apiUrl } = useContext(ApiContext)
  const { cartItems, setCartItems, addToCart, incrementQuantity, decrementQuantity } = useContext(cartContext)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const sessionId = params.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      window.history.replaceState({}, document.title, window.location.pathname);

      fetch(`${apiUrl}/carrito/confirmar-pago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      })
        .then((res) => {
          if (!res.ok) throw new Error('Error al confirmar pago');
          return res.json();
        })
        .then((data) => {
          setCartItems([]);
          alert(`¡Pago exitoso! Pedido #${data.pedido_id} creado.`);
        })
        .catch((err) => {
          console.error(err);
          setCartItems([]);
          alert('¡Pago exitoso!');
        });
    } else if (paymentStatus === 'cancel') {
      window.history.replaceState({}, document.title, window.location.pathname);
      alert('El pago fue cancelado.');
    }
  }, [apiUrl]);


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
          />
        )
      case 'manillas':
        return (
          <Manillas
            products={productCatalog.manillas.products}
            onAddToCart={addToCart}
            title={productCatalog.manillas.title}
            subtitle={productCatalog.manillas.subtitle}
          />
        )
      case 'aretes':
        return (
          <Aretes
            products={productCatalog.aretes.products}
            onAddToCart={addToCart}
            title={productCatalog.aretes.title}
            subtitle={productCatalog.aretes.subtitle}
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
          <Welcome onAddToCart={addToCart} />
        )
    }
  }

  const irACheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
  };

  if (cartCount > previousCartAmount.current) {
    previousCartAmount.current = cartItems.length 
    setIsCartOpen(true);
  }

  previousCartAmount.current = cartItems.length;

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
        onCheckout={irACheckout}
      />
      <Detalles />
      <WhatsAppButton />
      {showLogin && <Login onClose={() => setShowLogin(false)} onNavigate={setCurrentPage} />}
    </>
  )
}

export default App
