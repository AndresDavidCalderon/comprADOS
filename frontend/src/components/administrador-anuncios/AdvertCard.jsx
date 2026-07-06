import "./AdvertCard.css"
import square_placeholder from "../../assets/square_placeholder.jpeg"

export default function AdvertCard({ advert,  onEdit, onHide,onShow }) {
    return (
        <div className="advert-card">
            <div>
                <h3 className="advert-title">{advert.name}</h3>
                <h4>${advert.price.toLocaleString('es-CO')}</h4>
                <h4>{advert.quantity} disponibles</h4>
            </div>
            <img
                className="advert-image"
                src={advert.photos[0] ? advert.photos[0] : ""}
                alt={advert.name} />
            <div className="advert-actions">
                <button type="button" className="btn btn-primary advert-edit-btn" onClick={onEdit}>
                    Editar
                </button>{
                advert.oculto ? (
                    <button type="button" className="btn btn-primary advert-edit-btn advert-show-btn" onClick={onShow}>
                        Mostrar
                    </button>
                ) : (
                    <button type="button" className="btn btn-primary advert-edit-btn advert-hide-btn" onClick={onHide}>
                        Ocultar
                    </button>
                )
                }
            </div>
        </div>
    )
}