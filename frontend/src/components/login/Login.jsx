import { useState } from "react"
import './Login.css'

export default function Login({ onClose }) {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')

  const handleSubmit = () => {
    console.log('Entrando con:', { usuario, contrasena })
    // aquí luego pones tu lógica real
    onClose()
  }

  useEffect(() => {
          fetch("http://localhost:8000/productos")
          .then(response => response.json())
          .then(data => setUsuario(data))
          .then(data => setContrasena(data))
      }, [])
  
  const user = usuario.filter()
  const password = contrasena.filter()
  
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