import { useState,useContext } from "react"
import './review.css'

export default function Login({ onClose }) {
    const [estrellas, setEstrellas] = useState('')
    const [comentario, setComentario] = useState('')

    const handleSubmit = async () => {
        
        try {
            const response = await fetch("http://localhost:8000/auth/login", {
            method: "POST"
            })

        } catch (error) {
            console.error(error)
            alert("No se pudo conectar con el servidor. ¿Está corriendo el backend?")
        }
    }
    
    
    return (
        <div className="resena">
        
        </div>
    )

}