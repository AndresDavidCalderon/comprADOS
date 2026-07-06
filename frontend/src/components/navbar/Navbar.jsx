import { useState, useContext } from 'react'
import './Navbar.css'
import '../../context/AuthContext'
import AuthContext from '../../context/AuthContext'

export default function Navbar({ onLoginClick, onNavigate }) {
  const [cartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const auth = useContext(AuthContext)
  const sendOrder = () => {

  }

  // Navega y cierra el menú móvil
  const go = (page) => {
    onNavigate(page)
    setMenuOpen(false)
  }

  const handleHome = () => {
    go('home')
  }

  return (
    <nav className={`navbar${menuOpen ? ' open' : ''}`}>
      <div className="navbar-container">
        <button className="logo-btn" onClick={handleHome} title="Ir al Inicio">
          <span className="logo-text">ADOS me gusta</span>
        </button>

        <div className="categories" id="nav-categories">
          <a href="#" onClick={(e) => { e.preventDefault(); go('collares') }}>Collares</a>
          <a href="#" onClick={(e) => { e.preventDefault(); go('manillas') }}>Manillas</a>
          <a href="#" onClick={(e) => { e.preventDefault(); go('aretes') }}>Aretes</a>
          { auth.isAuthenticated &&
            <>
            <a href="#" onClick={(e) => { e.preventDefault(); go('adverts') }}>Anuncios</a>
          <a href="#" onClick={(e) => { e.preventDefault(); go('notice') }}>Notificaciones</a>
            </>
          }

        </div>

        <div className="nav-icons">
          <button className="icon-btn" aria-label="Mi cuenta" title="Mi cuenta" onClick={onLoginClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          <button className="icon-btn cart" onClick={sendOrder} aria-label={`Carrito (${cartCount} items)`} title={`Carrito (${cartCount} items)`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
          <button
            className="nav-toggle"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="nav-categories"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>

      </div>

      <div
        className="nav-overlay"
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      ></div>
    </nav>
  )
}
