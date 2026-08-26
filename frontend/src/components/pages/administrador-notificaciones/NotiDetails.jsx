import { useState, useEffect, useMemo,useContext } from "react"
import square_placeholder from "@/assets/square_placeholder.jpeg"
import "./NotiDetails.css"
import ApiContext from "@/context/ApiContext";

export default function NotiDetails({ order, onEstadoChange }) {
    const { apiUrl } = useContext(ApiContext);

    const [catalogProducts, setCatalogProducts] = useState([])
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [statusError, setStatusError] = useState(null)

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
    }, [order, apiUrl])

    const productList = useMemo(() => {
        if (!order?.items?.length) {
            return []
        }

        return order.items.map((item) => {
            const product = catalogProducts.find((p) => Number(p.id) === Number(item.product_id))
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

    const montoGuardado = Number(order?.total_price)
    const monto = Number.isFinite(montoGuardado) && montoGuardado > 0 ? montoGuardado : montoCalculado

    const currentStatus = order.status || "pending"
    const handleComplete = async () => {
            setUpdatingStatus(true)
            setStatusError(null)
            if (!window.confirm("¿La venta ya fue finalizada?")) {
                setUpdatingStatus(false)
                setStatusError("Actualización cancelada por el usuario.")
                return;
            }
            try {
                const res = await fetch(`${apiUrl}/orders/${order.id}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'completed' }),
                })
                if (!res.ok) throw new Error('Error actualizando el estado')
                const updatedOrder = await res.json()
                if (onEstadoChange) onEstadoChange(updatedOrder)
            } catch (err) {
                console.error(err)
                setStatusError('No se pudo actualizar el estado. Intenta de nuevo.')
            } finally {
                setUpdatingStatus(false)
            }
        }

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
                    <div key={ item.product_id} className="noti-obj-group">
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
                <h2 className="noti-text">{order.client.dni}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Nombre:</h2>
                <h2 className="noti-text">{order.client.name}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Teléfono:</h2>
                <h2 className="noti-text">{order.client.phone}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Dirección:</h2>
                <h2 className="noti-text">{order.client.department}, {order.client.municipality}, {order.client.street} con {order.client.race}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Monto:</h2>
                <h2 className="noti-text">{monto}</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Modo de Pago: </h2>
                <h2 className="noti-text">  
                    {order.payment_method === 'cash' ? ' Efectivo' : 
                    order.payment_method === 'card' ? ' Tarjeta' : 
                    order.payment_method || 'No especificado'}
                </h2>
            </div>

            <div className="noti-info">
                <h2 className="noti-subtitle">Detalles:</h2>
                <h2 className="noti-text">{order.client.extra_details}</h2>
            </div>

            <div className="estado-container">
            <div className="noti-info estado-part">
                <h2 className="noti-subtitle">Estado:</h2>
                <h2 className="noti-text">{{"completed":"completado","pending":"pendiente"}[currentStatus]}</h2>
            </div>

            {currentStatus !== 'completed' && (
                <div className="estado-btn-container">
                    <button
                        className="botonPequeño"
                        onClick={handleComplete}
                        disabled={updatingStatus}
                    >
                        {updatingStatus ? 'Actualizando...' : 'Marcar como finalizado'}
                    </button>
                    {statusError && <span className="error">{statusError}</span>}
                </div>
            )}
            </div>
        </div>
    </div>
    )
}