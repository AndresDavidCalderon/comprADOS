import { useState, useContext } from 'react'
import './Navbar.css'
import '../../context/AuthContext'
import AuthContext from '../../context/AuthContext'
import searchIcon from "../../assets/search.svg"
import {TextField} from "@mui/material"
import icono from "@/assets/icono.png"

export default function Navbar({ onLoginClick, onNavigate, onCartClick, cartCount = 0, search}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const auth = useContext(AuthContext)
  const [searchTerm, setSearchTerm] = useState('')
 
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
        <div className="nav-top">
          <div className="nav-brand" onClick={handleHome}>
            <img src={icono} alt="Logo" className="logo-img" />
            <button className="logo-btn" onClick={handleHome} title="Ir al Inicio">
              <span className="logo-text">ADOS me gusta</span>
            </button>
          </div>
          <div className="nav-right">
            <div className="search-container">
              <img src={searchIcon} alt="Buscar" className="search-icon" onClick={() => setSearching((s) => !s)} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                className="search-input"
                placeholder="Buscar productos..."
                onFocus={() => setSearching(true)}
                onBlur={() => setSearching(false)}
                onKeyDown={(e) => { if (e.key === 'Enter') { search(searchTerm) } }}
                variant="standard"
              />
            </div>
            <div className="nav-icons">
              <button className="icon-btn" aria-label="Mi cuenta" title="Mi cuenta" onClick={onLoginClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              <button
                type="button"
                className="icon-btn cart"
                aria-label={`Carrito (${cartCount} items)`}
                title={`Carrito (${cartCount} items)`}
                onClick={onCartClick}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span className="cart-badge">{cartCount}</span>
              </button>
              <button
                className="nav-toggle"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={menuOpen}
                aria-controls="nav-categories"
                onClick={() => setMenuOpen((o) => !o)}
              >
              </button>
            </div>
          </div>
        </div>
        <div className="categories" id="nav-categories">
          <a href="#" onClick={(e) => { e.preventDefault(); go('collares') }}>COLLARES</a>
          <a href="#" onClick={(e) => { e.preventDefault(); go('manillas') }}>MANILLAS</a>
          <a href="#" onClick={(e) => { e.preventDefault(); go('aretes') }}>ARETES</a>
          { auth.isAuthenticated &&
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); go('adverts') }}>ANUNCIOS</a>
              <a href="#" onClick={(e) => { e.preventDefault(); go('notice') }}>NOTIFICACIONES</a>
            </>
          }
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
