import { useState } from "react"
import square_placeholder from "../../assets/square_placeholder.jpeg"
import "./NotiDetails.css"
export default function NotiDetails() {
     return (<>
        <div className="info-notificacion">
            <div className="Pedidos">
            <h1>Pedido:</h1>
            <h2>Collar #1</h2>
            </div>
            <h2>Fecha: 2023-10-10</h2>
            <h2>Id: 12345</h2>
            <h2>Nombre: Rosa Lía</h2>
            <h2>Teléfono: 123-456-7890</h2>
            <h2>Dirección: 123 Calle Principal</h2>
            <h2>Monto: $100.00</h2>
            <h2>Estado: En proceso</h2>
        </div>
    </>
    )
}