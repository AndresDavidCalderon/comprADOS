import React from "react";
import square_placeholder from "../../assets/square_placeholder.jpeg";
import "./CreateAdvert.css";

export default function CreateAdvert() {
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
        <form className="create-form">
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

          <div className="form-label keywords">
            <div className="label-title">Palabras Clave</div>
            <div className="keywords-list">
              <button type="button" className="keyword">Color</button>
              <button type="button" className="keyword">Material</button>
              <button type="button" className="keyword">Género</button>
              <button type="button" className="keyword">Talla</button>
              <button type="button" className="keyword">Categoría</button>
            </div>
          </div>

          <button type="submit" className="publish-btn">Publicar</button>
          </form>
      </div>
    </div>
  );
}
