import { useState, useEffect, useContext } from "react"
import ApiContext from "../../context/ApiContext"
import './review.css'

export default function Reviews({ productId }) {
    const { apiUrl } = useContext(ApiContext)

    const [reviews, setReviews] = useState([])       // reseñas ya existentes
    const [estrellas, setEstrellas] = useState(0)    // estrellas seleccionadas
    const [hover, setHover] = useState(0)            // estrella sobre la que está el mouse
    const [comentario, setComentario] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState('')

    // Cargar las reseñas del producto cuando se abre el detalle
    useEffect(() => {
        if (!productId) return

        const cargarReviews = async () => {
            try {
                const res = await fetch(`${apiUrl}/reviews/${productId}`)
                if (!res.ok) throw new Error("No se pudieron cargar las reseñas")
                setReviews(await res.json())
            } catch (e) {
                console.error(e)
            }
        }

        cargarReviews()
    }, [productId, apiUrl])

    const handleSubmit = async () => {
        setError('')

        // Validaciones sencillas antes de enviar
        if (estrellas === 0) {
            setError("Selecciona al menos una estrella")
            return
        }
        if (comentario.trim() === '') {
            setError("Escribe un comentario")
            return
        }

        try {
            setEnviando(true)
            const res = await fetch(`${apiUrl}/reviews/${productId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estrellas, comentario }),
            })
            if (!res.ok) throw new Error("No se pudo enviar la reseña")

            const nueva = await res.json()
            setReviews((prev) => [...prev, nueva])  // mostrarla sin recargar
            setEstrellas(0)
            setComentario('')
        } catch (e) {
            console.error(e)
            setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?")
        } finally {
            setEnviando(false)
        }
    }

    // Promedio de estrellas para mostrar un resumen
    const promedio = reviews.length
        ? reviews.reduce((suma, r) => suma + (r.estrellas || 0), 0) / reviews.length
        : 0

    return (
        <div className="resena">
            {/* Formulario para dejar una nueva reseña */}
            <div className="resena-form">
                <div className="resena-estrellas">
                    {[1, 2, 3, 4, 5].map((valor) => (
                        <button
                            type="button"
                            key={valor}
                            className={`estrella ${valor <= (hover || estrellas) ? 'activa' : ''}`}
                            onClick={() => setEstrellas(valor)}
                            onMouseEnter={() => setHover(valor)}
                            onMouseLeave={() => setHover(0)}
                            aria-label={`${valor} estrellas`}
                        >
                            ★
                        </button>
                    ))}
                </div>

                <textarea
                    className="resena-textarea"
                    placeholder="Escribe tu opinión sobre este producto..."
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    maxLength={500}
                />

                {error && <p className="resena-error">{error}</p>}

                <button className="btn-primary" onClick={handleSubmit} disabled={enviando}>
                    {enviando ? "Enviando..." : "Publicar reseña"}
                </button>
            </div>

            {/* Lista de reseñas existentes */}
            <div className="resena-lista">
                {reviews.length === 0 && (
                    <p className="resena-vacia">Todavía no hay reseñas. ¡Sé el primero!</p>
                )}

                {reviews.length > 0 && (
                    <p className="resena-promedio">
                        Promedio: {promedio.toFixed(1)} ★ ({reviews.length})
                    </p>
                )}

                {reviews.map((r) => (
                    <div className="resena-item" key={r.id}>
                        <div className="resena-item-estrellas">
                            {'★'.repeat(r.estrellas || 0)}
                            {'☆'.repeat(5 - (r.estrellas || 0))}
                        </div>
                        <p className="resena-item-texto">{r.texto}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
