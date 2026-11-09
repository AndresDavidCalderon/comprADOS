import { useState,useContext } from "react"
import './Login.css'
import AuthContext from "../../context/AuthContext"
import ApiContext from "../../context/ApiContext"

export default function Login({ onClose,onNavigate }) {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const auth = useContext(AuthContext)
  const { apiUrl } = useContext(ApiContext);

  const handleSubmit = async () => {
    if (auth.isAuthenticated) {
      auth.logout()
      onClose()
      return
    } else {
      try {
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "username": usuario, "password": contrasena })
        })

        if (response.ok) {
          const data = await response.json()
          console.log(data)
          auth.login(data.token)
          onNavigate?.('adverts')
          onClose()
        } else {
          switch (response.status) {
            case 401:
              alert("Usuario o contraseña incorrectos")
              break
            default:
              alert("Error en el inicio de sesión")
            }
            
        }
      } catch (error) {
        console.error("Error en login:", error)
        alert("No se pudo conectar con el servidor. ¿Está corriendo el backend?")
      }
    }
}
  
  return (
    <div className={auth.isAuthenticated ? "login-modal logout-modal" : "login-modal"}>
      <div className="login-box">
        <button className="close-btn" onClick={onClose}>×</button>

        {
        auth.isAuthenticated ?
        <>
        <h1 className = "start">¿Deseas Cerrar Sesión?</h1>
        <button className="close-session btn-contrast" onClick={handleSubmit}>Cerrar Sesión</button>
        </>:
        <>
        <h1 className="start">Iniciar Sesión</h1>
        <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <label className="form-label">
            Usuario
            <input
              className="text-input"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </label>

          <div className="form-label">
            <label htmlFor="login-password">Contraseña</label>
            <div className="password-input-wrap">
              <input
                id="login-password"
                className="text-input"
                type={mostrarContrasena ? "text" : "password"}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
              <button
                type="button"
                className="password-visibility-btn"
                aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={mostrarContrasena}
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
              >
                {mostrarContrasena ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
          <div className="centerer"> 
            <button type="submit" className="enter btn-contrast">Entrar</button>
          </div>
        </form>
        </>
      }

      </div>
    </div>
  )
}