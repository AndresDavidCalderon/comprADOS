import { useState, useEffect,useContext} from "react"
import "./NotiManager.css"
import NotiDetails from "./NotiDetails";
import ApiContext from "@/context/ApiContext";

export default function NotiManager() {
    const [currentPage, setCurrentPage] = useState('list')
    const [orderList, setOrderList] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const { apiUrl } = useContext(ApiContext);

    useEffect(() => {
        fetch(`${apiUrl}/orders`)
        .then(response => response.json())
        .then(data => setOrderList(data))
    }, [apiUrl])

    const handleStatusChange = (updatedOrder) => {
        setOrderList((prev) =>
            prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        )
        setSelectedOrder(updatedOrder)
    }

    const pendingOrders = orderList.filter(order => order.status === "pending" || order.status == null)
    const completedOrders = orderList.filter(order => order.status === "completed")

        switch (currentPage) {
            case 'list':
                return (
                    <>
                        <h1 className="noti-title">Ventas Pendientes</h1>
                        <div className="contenedor-notificacion" >
                        {pendingOrders.map((order) => (
                                <div className="tarjeta-notificacion" key={order.id}>
                                    <h1 className="noti-type">{order.id}</h1>
                                    <h2 className="noti-resume">{order.client.nombre}</h2>
                                    <h2 className="noti-resume">{order.status || 'pending'}</h2>
                                    <div className="noti-btn-container">
                                    <button className="botonPequeño" onClick={() => {setCurrentPage('more');setSelectedOrder(order)}}>Ver más</button>
                                    </div>
                                </div>  
                        ))}
                        </div>
                        <h1 className="noti-title">Ventas Completadas</h1>
                        <div className="contenedor-notificacion">
                        {completedOrders.map((order) => (
                                <div className="tarjeta-notificacion"  key={order.id}>
                                    <h1 className="noti-type">{order.id}</h1>
                                    <h2 className="noti-resume">{order.client.nombre}</h2>
                                    <h2 className="noti-resume">{order.status}</h2>
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
                                <NotiDetails order={selectedOrder} onEstadoChange={handleStatusChange}/>
                            </div>
                            <div className="ver-mas">
                                <button className="cta-btn"onClick={() => setCurrentPage('list')}>Ver otras ordenes</button>
                            </div>
                        </div>
                )
            default:
                return null
        }
}