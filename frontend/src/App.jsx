import { useState,useContext } from 'react'
import Navbar from './components/navbar/Navbar'
import Collares from './components/collares/Collares'
import Manillas from './components/manillas/Manillas'
import Aretes from './components/aretes/Aretes'
import Login from './components/login/Login'
import './App.css'
import AdvertsManager from './components/administrador-anuncios/AdvertsManager'
import NotiManager from './components/administrador-notificaciones/NotiManager'
import  AuthContext from './context/AuthContext'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [showLogin, setShowLogin] = useState(false)
  const auth = useContext(AuthContext)

  if ((!auth.isAuthenticated) && (currentPage === 'adverts' || currentPage === 'notice')) {
    setCurrentPage('home')
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'collares':
        return (
          <Collares
            title="Collares"
          />
        )
      case 'manillas':
        return (
          <Manillas
            title="Manillas"
          />
        )
      case 'aretes':
        return (
          <Aretes
            title="Aretes"
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
    />
    {renderPage()}
    {showLogin && <Login onClose={() => setShowLogin(false)} />}
    
  </>)
}

export default App
