import "./AdvertCard.css"

export default function AdvertCard({ advert }) {
    return (
        <div className="advert-card">
            <h3 className="advert-title">{advert.name}</h3>
            <h4>${advert.price.toLocaleString('es-CO')}</h4>
            <h4>{advert.quantity} disponibles</h4>
            <img
                className="advert-image"
                src={advert.photos[0] || square_placeholder}
                alt={advert.name} />
        </div>
    )
}