import { useState } from "react"
import './Login.css'

export default function Login({ onClose }) {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')

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
      </div>
    </div>
  )
}