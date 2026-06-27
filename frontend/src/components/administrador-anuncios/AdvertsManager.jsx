import { useState } from "react"
import square_placeholder from "../../assets/square_placeholder.jpeg"
import "./AdvertsManager.css"
import CreateAdvert from "./CreateAdvert";
export default function AdvertsManager() {
    const [currentPage, setCurrentPage] = useState('list')
    switch (currentPage) {
        case 'list':
            return (
                <div>
                    <h1>Anuncios</h1>
                    <button onClick={() => setCurrentPage('create')}>Publicar nuevo anuncio</button>
                    <h2>Visibles</h2>
                    <div className="advert-list">
                        <div className="advert-internal-card">
                            <h3 className="advert-title">Collar para hombre</h3>
                            <img
                                className="advert-image"
                                src={square_placeholder}
                                alt="Collar para hombre" />
                        </div>
                    </div>
                    <h2>Ocultos</h2>
                </div>
                )
        case 'create':
            return (
                <div>
                    <button onClick={() => setCurrentPage('list')}>Volver a la lista</button>
                    <CreateAdvert onPublish={() => setCurrentPage('list')} />
                </div>
            )
        default:
            return null
    }
}