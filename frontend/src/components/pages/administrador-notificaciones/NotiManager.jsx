import { useState, useEffect,useContext} from "react"
import square_placeholder from "@/assets/square_placeholder.jpeg"
import "./NotiManager.css"
import NotiDetails from "./NotiDetails";
import ApiContext from "@/context/ApiContext";

export default function NotiManager() {
    const [currentPage, setCurrentPage] = useState('list')
    const [orderList, setOrderList] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const { apiUrl } = useContext(ApiContext);

    useEffect(() => {
        fetch(`${apiUrl}/ordenes`)
        .then(response => response.json())
        .then(data => setOrderList(data))
    }, [])

    const handleEstadoChange = (updatedOrder) => {
        setOrderList((prev) =>
            prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        )
        setSelectedOrder(updatedOrder)
    }

    const VentasPendientes = orderList.filter(order => order.estado == "Pendiente" || order.estado == null)
    const VentasCompletadas = orderList.filter(order => order.estado === "Finalizado")

        switch (currentPage) {
            case 'list':
                return (
                    <>
                        <h1 className="noti-title">Ventas Pendientes</h1>
                        <div className="contenedor-notificacion" >
                        {VentasPendientes.map((order) => (
                                <div className="tarjeta-notificacion" key={order.id}>
                                    <h1 className="noti-type">{order.id}</h1>
                                    <h2 className="noti-resume">{order.cliente.nombre}</h2>
                                    <h2 className="noti-resume">{order.estado || 'Pendiente'}</h2>
                                    <div className="noti-btn-container">
                                    <button className="botonPequeño" onClick={() => {setCurrentPage('more');setSelectedOrder(order)}}>Ver más</button>
                                    </div>
                                </div>  
                        ))}
                        </div>
                        <h1 className="noti-title">Ventas Completadas</h1>
                        <div className="contenedor-notificacion">
                        {VentasCompletadas.map((order) => (
                                <div className="tarjeta-notificacion"  key={order.id}>
                                    <h1 className="noti-type">{order.id}</h1>
                                    <h2 className="noti-resume">{order.cliente.nombre}</h2>
                                    <h2 className="noti-resume">{order.estado}</h2>
                                    <div className="noti-btn-container">
                                    <button className="botonPequeño" onClick={() => {setCurrentPage('more');setSelectedOrder(order)}}>Ver más</button>
                                    </div>
                                </div>  
                        ))}
                        </div>
                    </>
                    )
            case 'more':
                return (
                        <div className="info-notificacion">
                            <div className="detalles">
                                <NotiDetails order={selectedOrder} onEstadoChange={handleEstadoChange}/>
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