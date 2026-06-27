import { useState,useEffect } from "react"
import square_placeholder from "../../assets/square_placeholder.jpeg"
import "./AdvertsManager.css"
import CreateAdvert from "./CreateAdvert";
import AdvertCard from "./AdvertCard";

export default function AdvertsManager() {
    const [currentPage, setCurrentPage] = useState('list')
    const [advertList, setAdvertList] = useState([])
    useEffect(() => {
        fetch("http://localhost:8000/productos")
        .then(response => response.json())
        .then(data => setAdvertList(data))
    }, [])
    switch (currentPage) {
        case 'list':
            return (
                <div>
                    <h1>Anuncios</h1>
                    <button onClick={() => setCurrentPage('create')}>Publicar nuevo anuncio</button>
                    <h2>Visibles</h2>
                    <div className="advert-list">
                        {advertList.filter(advert => advert.quantity > 0).map(advert => (
                            <AdvertCard key={advert.id} advert={advert} />
                        ))}
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