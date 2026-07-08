import { useState } from "react";
import Pagos from "../pagos/Pagos";
import "./Datos.css";

export default function Datos({ onClose, onFinalizarCompra}) {
  const [showPagos, setShowPagos] = useState(false);
  const handleConfirm = () => {
    setShowPagos(true);
  };

  const [datosCliente, setDatosCliente] = useState({ // Almacen de los datos del cliente
  identificacion: "",
  telefono: "",
  nombre: "",
  departamento: "",
  municipio: "",
  carrera: "",
  calle: "",
  detalles_extra: ""
  });

  if (showPagos) {
      return (
        <Pagos
            datosCliente={datosCliente}
            onConfirm={onFinalizarCompra}
            onClose={onClose}
        />
    );
  }

  return (
    <div className="datos-overlay">
    <div className="contenedor-datos">
      <div className="forms">
        <h1>formulario</h1>
        {/* Pedir los datos del cliente */}
        {/* Guardar los datos del cliente en el estado datosCliente */}
      </div>

      <div className="continuar">
        <button
          className="datos-btn"
          onClick={handleConfirm}
        >
          Continuar
        </button>
      </div>

      <button
        className="close-btn"
        onClick={onClose}
      >
        ×
      </button>
    </div>
    </div>
  );
}