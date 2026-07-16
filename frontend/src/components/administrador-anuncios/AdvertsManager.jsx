import { useState,useEffect,useContext } from "react"
import square_placeholder from "../../assets/square_placeholder.jpeg"
import "./AdvertsManager.css"
import CreateAdvert from "./CreateAdvert";
import AdvertCard from "./AdvertCard";
import "../../buttons.css"
import ApiContext from "../../context/ApiContext";

export default function AdvertsManager() {
    const [currentPage, setCurrentPage] = useState('list')
    const [advertList, setAdvertList] = useState([])
    const [editingProduct, setEditingProduct] = useState(null)
    const { apiUrl } = useContext(ApiContext);

    const fetchAdverts = () => {
        fetch(`${apiUrl}/productos`)
        .then(response => response.json())
        .then(data => setAdvertList(data))
    }

    useEffect(() => {
        fetchAdverts()
    }, [])


    const deleteAdvert = (advertId) => {
        fetch(`${apiUrl}/productos/${advertId}`, {
            method: "DELETE"
        })
        .then(response => {
            fetchAdverts()
        }
        )
    }

    const startEdit = (advert) => {
        setEditingProduct(advert)
        setCurrentPage('create')
    }

    const switchShow = (advertId,show) => {
        fetch(`${apiUrl}/productos/${advertId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ oculto: !show })
        })
        .then(response => {
            fetchAdverts()
        })
    }

    const VisibleAdverts = advertList.filter(advert => advert.quantity > 0 && !advert.oculto)
    const nonVisibleAdverts = advertList.filter(advert => advert.quantity <= 0 || advert.oculto)
    const page = () => {
        switch (currentPage) {
            case 'list':
                return (
                    <div>
                        <h1>Anuncios</h1>
                        <button onClick={() => {setCurrentPage('create'); setEditingProduct(null)}} className="btn btn-primary">Publicar nuevo anuncio</button>
                        <h2>Visibles</h2>
                        <div className="advert-list">
                            {VisibleAdverts.map(advert => (
                                <AdvertCard key={advert.id} advert={advert} onHide={()=> switchShow(advert.id, false)} onEdit={() => startEdit(advert)} />
                            ))}
                            {VisibleAdverts.length === 0 && <p>No hay anuncios visibles</p>}
                        </div>
                        <h2>Ocultos</h2>
                        <div className="advert-list">
                            {nonVisibleAdverts.map(advert => (
                                <AdvertCard key={advert.id} advert={advert} onShow={() => switchShow(advert.id, true)} onEdit={() => startEdit(advert)} />
                            ))}
                            {nonVisibleAdverts.length === 0 && <p>No hay anuncios ocultos o sin disponibilidad</p>}
                        </div>
                    </div>
                    )
            case 'create':
                return (
                    <div>
                        <button className="btn-contrast" onClick={() => setCurrentPage('list')}>Volver a la lista</button>
                        <CreateAdvert onPublish={() => setCurrentPage('list')} editingProduct={editingProduct} switchShow={switchShow} />
                    </div>
                )
            default:
                return null
        }
    }
    return <div className="adverts-manager">{page()}</div>
}