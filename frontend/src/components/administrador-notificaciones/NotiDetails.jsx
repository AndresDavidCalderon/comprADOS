import { useState } from "react"
import square_placeholder from "../../assets/square_placeholder.jpeg"
import "./NotiDetails.css"
export default function NotiDetails() {
     return (
     <>

        <div className="noti-pedidos">
            <h1 className="noti-title">Pedido:</h1>
            <h2 className="noti-obj">Collar #1</h2>
        </div>

        <div className="noti-detalles">
            <div className="noti-info">
                <h2 className="noti-subtitle">Fecha:</h2>
                <h2 className="noti-text">2023-10-10</h2>
            </div>
        
            <div className="noti-info">
                <h2 className="noti-subtitle">Id:</h2>
                <h2 className="noti-text">12345</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Nombre:</h2>
                <h2 className="noti-text">Rosa Lía</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Teléfono:</h2>
                <h2 className="noti-text">123-456-7890</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Dirección:</h2>
                <h2 className="noti-text">123 Calle Principal</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Monto:</h2>
                <h2 className="noti-text">$100.00</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Estado:</h2>
                <h2 className="noti-text">En proceso</h2>
            </div>
            <div className="noti-info">
                <h2 className="noti-subtitle">Detalles:</h2>
                <h2 className="noti-text">None</h2>
            </div>
        </div>
    </>
    )
}