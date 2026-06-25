import square_placeholder from "../../assets/square_placeholder.jpeg";
import TagDialogue from "./TagDialogue";
import "./CreateAdvert.css";
import { useState } from "react";

export default function CreateAdvert() {
  const  [selectingTags, setSelectingTags] = useState(false);
  return (
    <div className="create-advert-container">
      <div className="create-left-card">
        <div className="image-window">
          <img src={square_placeholder} alt="Referencia" className="reference-img" />
        </div>
        <h3 className="reference-caption">Foto de Referencia</h3>
      </div>

      <div className="create-right-card">
        <h2 className="create-title">Nueva Pieza</h2>
          <label className="form-label">
            Nombre
            <input className="text-input" type="text" name="name" />
          </label>

          <label className="form-label">
            Descripción del producto
            <textarea className="textarea-input" name="description" rows="4" />
          </label>

          <label className="form-label">
            Cantidad Disponible
            <input className="text-input" type="number" name="quantity" />
          </label>
          <label className="form-label">
            Precio
            <input className="text-input" type="number" name="price" />
          </label>
          <label className="form-label">
            Palabras Clave
          </label>
          <button onClick={() => setSelectingTags(true)}>
            Seleccionar
          </button>
          {selectingTags && <TagDialogue />}
      </div>
    </div>
  );
}
