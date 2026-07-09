import { useState, useEffect} from "react"
import square_placeholder from "../../assets/square_placeholder.jpeg"
import "./NotiManager.css"
import NotiDetails from "./NotiDetails";
import ApiContext from "../../context/ApiContext";

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

        switch (currentPage) {
            case 'list':
                return (
                    <>
                        {orderList.map((order) => (
                            <div className="contenedor-notificacion" key={order.id}>
                                <div className="tarjeta-notificacion">
                                    <h1 className="noti-type">{order.id}</h1>
                                    <h2 className="noti-resume">{order.cliente.nombre}</h2>
                                    <h2 className="noti-resume">{order.estado}</h2>
                                    <div className="noti-btn-container">
                                    <button className="botonPequeño" onClick={() => {setCurrentPage('more');setSelectedOrder(order)}}>Ver más</button>
                                    </div>
                                </div>  
                            </div>
                        ))}
                        
                    </>
                    )
            case 'more':
                return (
                        <div className="info-notificacion">
                            <div className="detalles">
                                <NotiDetails order={selectedOrder}/>
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