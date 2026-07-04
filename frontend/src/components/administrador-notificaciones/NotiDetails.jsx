import { useState, useEffect } from "react"
import square_placeholder from "../../assets/square_placeholder.jpeg"
import "./NotiDetails.css"

export default function NotiDetails({ order }) {
    const [productList, setProductList] = useState([])

    useEffect(() => {
        fetch("http://localhost:8000/productos/")
            .then(response => response.json())
            .then(data => setProductList(data))
            .catch(err => console.error("error trayendo productos:", err))
    }, [])

    return (
    <>
        <div className="noti-pedidos">
            <h1 className="noti-title">Pedido: {order.id}</h1>
            {order.productos.map((item) => {
                // busco en el catálogo el producto con el mismo id para sacar nombre y foto
                const producto = productList.find((p) => p.id === item.id)
                const foto = producto && producto.photos && producto.photos.length > 0
                    ? producto.photos[0]
                    : square_placeholder
                return (
                    <div key={item.id} className="noti-obj-group">
                        <img className="noti-obj-img" src={foto} alt={producto ? producto.name : "producto"} />
                        <div>
                            <h2 className="noti-obj">{producto ? producto.name : "Cargando..."}</h2>
                            <h2 className="noti-obj">Cantidad: {item.quantity}</h2>
                            <h2 className="noti-obj">Precio: {item.price}</h2>
                        </div>
                    </div>
                )
            })}
        </div>

        <div className="noti-detalles">
            <div className="noti-info">
                <h2 className="noti-subtitle">Fecha:</h2>
                <h2 className="noti-text">{order.fecha}</h2>
            </div>

            <div className="noti-info">
                <h2 className="noti-subtitle">Documento de Identidad:</h2>
                <h2 className="noti-text">{order.cc}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Nombre:</h2>
                <h2 className="noti-text">{order.nombre}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Teléfono:</h2>
                <h2 className="noti-text">{order.telefono}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Dirección:</h2>
                <h2 className="noti-text">{order.direccion}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Monto:</h2>
                <h2 className="noti-text">{order.monto}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Modo de Pago:</h2>
                <h2 className="noti-text">{order["modo de pago"]}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Estado:</h2>
                <h2 className="noti-text">{order.estado}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Detalles:</h2>
                <h2 className="noti-text">{order.detalles}</h2>
            </div>
        </div>
    </>
    )
}