import { useState,useEffect } from "react"
import square_placeholder from "../../assets/square_placeholder.jpeg"
import "./AdvertsManager.css"
import CreateAdvert from "./CreateAdvert";
import AdvertCard from "./AdvertCard";
import "../../buttons.css"

export default function AdvertsManager() {
    const [currentPage, setCurrentPage] = useState('list')
    const [advertList, setAdvertList] = useState([])
    useEffect(() => {
        fetch("http://localhost:8000/productos")
        .then(response => response.json())
        .then(data => setAdvertList(data))
    }, [])

    const VisibleAdverts = advertList.filter(advert => advert.quantity > 0)
    const nonVisibleAdverts = advertList.filter(advert => advert.quantity <= 0)
    const page = () => {
        switch (currentPage) {
            case 'list':
                return (
                    <div>
                        <h1>Anuncios</h1>
                        <button onClick={() => setCurrentPage('create')} className="btn btn-primary">Publicar nuevo anuncio</button>
                        <h2>Visibles</h2>
                        <div className="advert-list">
                            {VisibleAdverts.map(advert => (
                                <AdvertCard key={advert.id} advert={advert} />
                            ))}
                            {VisibleAdverts.length === 0 && <p>No hay anuncios visibles</p>}
                        </div>
                        <h2>Ocultos</h2>
                        <div className="advert-list">
                            {nonVisibleAdverts.map(advert => (
                                <AdvertCard key={advert.id} advert={advert} />
                            ))}
                            {nonVisibleAdverts.length === 0 && <p>No hay anuncios ocultos o sin disponibilidad</p>}
                        </div>
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
    return <div className="adverts-manager">{page()}</div>
}