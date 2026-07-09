import { useState,useContext } from "react"
import './Login.css'
import AuthContext from "../../context/AuthContext"
import ApiContext from "../../context/ApiContext"

export default function Login({ onClose }) {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const auth = useContext(AuthContext)

  const handleSubmit = async () => {
    if (auth.isAuthenticated) {
      auth.logout()
      onClose()
      return
    } else {
      try {
        const { apiUrl } = useContext(ApiContext);
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario, contrasena })
        })

        if (response.ok) {
          const data = await response.json()
          console.log(data)
          onClose()
          auth.login()
        } else {
          alert("Usuario o contraseña incorrectos")
        }
      } catch (error) {
        console.error(error)
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

        <label className="form-label">
          Usuario
          <input
            className="text-input"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </label>

        <label className="form-label">
          Contraseña
          <input
            className="text-input"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </label>
        <div className="centerer"> 
          <button className="enter btn-contrast" onClick={handleSubmit}>Entrar</button>
        </div>
        </>
      }

      </div>
    </div>
  )
}