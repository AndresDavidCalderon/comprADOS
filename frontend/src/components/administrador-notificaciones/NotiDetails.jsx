import { useState, useEffect, useMemo,useContext } from "react"
import square_placeholder from "../../assets/square_placeholder.jpeg"
import "./NotiDetails.css"
import ApiContext from "../../context/ApiContext";

export default function NotiDetails({ order }) {
    const { apiUrl } = useContext(ApiContext);

    const [catalogProducts, setCatalogProducts] = useState([])

    useEffect(() => {
        if (!order?.items?.length) {
            return
        }

        fetch(`${apiUrl}/productos/`)
            .then(response => response.json())
            .then(data => {
                setCatalogProducts(data)
            })
            .catch(err => console.error("error trayendo productos:", err))
    }, [order])

    const productList = useMemo(() => {
        if (!order?.items?.length) {
            return []
        }

        return order.items.map((item) => {
            const product = catalogProducts.find((p) => Number(p.id) === Number(item.producto_id))
            return {
                ...item,
                producto: product || null,
            }
        })
    }, [order, catalogProducts])

    const montoCalculado = productList.reduce((total, item) => {
        const price = Number(item.producto?.price ?? 0)
        const quantity = Number(item.cantidad ?? item.quantityOnCart ?? 0)
        return total + (price * quantity)
    }, 0)

    const montoGuardado = Number(order?.total)
    const monto = Number.isFinite(montoGuardado) && montoGuardado > 0 ? montoGuardado : montoCalculado

    return (
    <div className="noti-details">
        <div className="noti-pedidos">
            <h1 className="noti-title">Pedido: {order.id}</h1>
            {productList.map((item) => {
                // busco en el catálogo el producto con el mismo id para sacar nombre y foto
                const foto = item.producto && item.producto.photos && item.producto.photos.length > 0
                    ? item.producto.photos[0]
                    : square_placeholder
                return (
                    <div key={item.producto ? item.producto.id : item.producto_id} className="noti-obj-group">
                        <img className="noti-obj-img" src={foto} alt={item.producto ? item.producto.name : "producto"} />
                        <div>
                            <h2 className="noti-obj">{item.producto ? item.producto.name : "Cargando..."}</h2>
                            <h2 className="noti-obj">Cantidad: {item.cantidad}</h2>
                            <h2 className="noti-obj">Precio: {item.producto ? item.producto.price : "Cargando..."}</h2>
                        </div>
                    </div>
                )
            })}
        </div>

        <div className="noti-detalles">
            <div className="noti-info">
                <h2 className="noti-subtitle">Fecha:</h2>
                <h2 className="noti-text">{order.created_at}</h2>
            </div>

            <div className="noti-info">
                <h2 className="noti-subtitle">Documento de Identidad:</h2>
                <h2 className="noti-text">{order.cliente.identificacion}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Nombre:</h2>
                <h2 className="noti-text">{order.cliente.nombre}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Teléfono:</h2>
                <h2 className="noti-text">{order.cliente.telefono}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Dirección:</h2>
                <h2 className="noti-text">{order.cliente.departamento}, {order.cliente.municipio}, {order.cliente.calle} con {order.cliente.carrera}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Monto:</h2>
                <h2 className="noti-text">{monto}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Modo de Pago:  
                    {order.metodo_pago === 'efectivo' ? ' Efectivo' : 
                    order.metodo_pago === 'tarjeta' ? ' Tarjeta' : 
                    order.metodo_pago || 'No especificado'}
                </h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Estado:</h2>
                <h2 className="noti-text">{order.estado}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Detalles:</h2>
                <h2 className="noti-text">{order.cliente.detalles_extra}</h2>
            </div>
        </div>
    </div>
    )
}