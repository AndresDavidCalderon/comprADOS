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
                                <h1 className="noti-type">Collar</h1>
                                <h2 className="noti-resume">Fecha</h2>
                                <h2 className="noti-resume">Rosa Lía</h2>
                                <button className="botonPequeño" onClick={() => setCurrentPage('more')}>Ver más</button>
                            </div>  
                        </div>
                    </>
                    )
            case 'more':
                return (
                        <div className="info-notificacion">
                            <div className="detalles">
                                <NotiDetails />
                            </div>
                            <div className="ver-mas">
                                <button className="cta-btn"onClick={() => setCurrentPage('list')}>Ver otros anuncios</button>
                            </div>
                        </div>
                )
            default:
                return null
        }
}