import { useState,useContext } from "react"
import './Login.css'
import AuthContext from "../../context/AuthContext"

export default function Login({ onClose }) {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const auth = useContext(AuthContext)

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
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
  
  return (
    <div className="login-modal">
      <div className="login-box">
        <button className="close-btn" onClick={onClose}>×</button>

        {
        !auth.isAuthenticated ? // si no es verdad que esté autenticado, then...
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

        <button className="enter-btn" onClick={handleSubmit}>Entrar</button>
      </>:
      <>
      <h1 className = "start">¿Deseas Cerrar Sesión?</h1>
      <button className="closeS-btn" onClick={handleSubmit}>Cerrar Sesión</button>
      </>
      }

      </div>
    </div>
  )
}