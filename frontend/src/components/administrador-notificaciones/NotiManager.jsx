import { useState } from "react"
import square_placeholder from "../../assets/square_placeholder.jpeg"
import "./NotiManager.css"
export default function NotiManager() {
    return (<>
        <div className="contenedor-notificacion">
            <div className="tarjeta-notificacion">
                <h1>Fecha</h1>
                <h2>Rosa Lía</h2>
                <h2>Collar</h2>
            </div>
        </div>
    </>
    )
}