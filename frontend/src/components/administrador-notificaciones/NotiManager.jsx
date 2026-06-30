import { useState } from "react"
import square_placeholder from "../../assets/square_placeholder.jpeg"
import "./NotiManager.css"
import NotiDetails from "./NotiDetails";
export default function NotiManager() {
    const [currentPage, setCurrentPage] = useState('list')
        switch (currentPage) {
            case 'list':
                return (
                    <>
                        <div className="contenedor-notificacion">
                            <div className="tarjeta-notificacion">
                                <h1>Collar</h1>
                                <h2>Fecha</h2>
                                <h2>Rosa Lía</h2>
                                <button onClick={() => setCurrentPage('more')}>Ver más</button>
                            </div>  
                        </div>
                    </>
                    )
            case 'more':
                return (
                    <div>
                        <button onClick={() => setCurrentPage('list')}>Ver otros anuncios</button>
                        <NotiDetails />
                    </div>
                )
            default:
                return null
        }
}