import { useState } from "react";
import "./Pagos.css";

export default function Pagos({ onConfirm }) {
  const [metodoPago, setMetodoPago] = useState("");
  const [pagoValidado, setPagoValidado] = useState(false);
  const paymentCheck = () => {
    alert("Pago realizado correctamente");
    setPagoValidado(true);
  };
  const handleConfirm = () => {
    if (!pagoValidado) {
      alert("Debes completar el proceso de pago.");
      return;
    }

    console.log("Método seleccionado:", metodoPago);
    onConfirm();
  };

  return (
    <div className="contenedor-pagos">
      <div className="contraentrega">
        <label className="opcion-pago">
          <input
            className="radio-btn"
            type="radio"
            name="metodoPago"
            value="contraentrega"
            checked={metodoPago === "contraentrega"}
            onChange={(e) => {
              setMetodoPago(e.target.value);
              setPagoValidado(true);
            }}
          />
          <h1 className="modo-pago">Pago Contraentrega</h1>
        </label>
      </div>

      <div className="enlinea">
        <label className="opcion-pago">
          <input
            className="radio-btn"
            type="radio"
            name="metodoPago"
            value="enlinea"
            checked={metodoPago === "enlinea"}
            onChange={(e) => {
              setMetodoPago(e.target.value);
              setPagoValidado(false);
            }}
          />
          <h1 className="modo-pago">Pago en Línea</h1>
        </label>

        <button
          className="botonPequeño botonAlign"
          onClick={paymentCheck}
          disabled={metodoPago !== "enlinea"}
        >
          Pasarela de Pago
        </button>

      </div>

      <div className="confirmar-pago">
        <button
          className="botonPequeño"
          onClick={handleConfirm}
          disabled={!pagoValidado}
        >
          Confirmar Pago
        </button>
      </div>

    </div>
  );
}
