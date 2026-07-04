import "./AdvertCard.css"
import square_placeholder from "../../assets/square_placeholder.jpeg"

export default function AdvertCard({ advert, onDelete, onEdit }) {
    return (
        <div className="advert-card">
            <h3 className="advert-title">{advert.name}</h3>
            <h4>${advert.price.toLocaleString('es-CO')}</h4>
            <h4>{advert.quantity} disponibles</h4>
            <img
                className="advert-image"
                src={advert.photos[0] ? advert.photos[0] : ""}
                alt={advert.name} />
            <div className="advert-actions">
                <button type="button" className="btn btn-primary advert-edit-btn" onClick={onEdit}>
                    Editar
                </button>
                <button type="button" className="btn btn-primary advert-delete-btn" onClick={onDelete}>
                    Eliminar
                </button>
            </div>
        </div>
    )
}