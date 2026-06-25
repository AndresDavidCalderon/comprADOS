import square_placeholder from "../../assets/square_placeholder.jpeg";
import TagDialogue from "./TagDialogue";
import "./CreateAdvert.css";
import { useState } from "react";

export default function CreateAdvert() {
  const  [selectingTags, setSelectingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [photoURLs, setPhotoURLs] = useState([square_placeholder]); // first is reference photo, rest are additional photos

  const confirmTags = (tags) => {
    setSelectingTags(false);
    setSelectedTags(tags);
  }

  const uploadReferencePhoto = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const form= new FormData();
        form.append("file", file,"file");
        fetch("http://127.0.0.1:8000/productos/imagenes/temporales", {
          method: "POST",
          body: form,
        }).then(response => response.json())
          .then(data => {
            const imageUrl = data.url; // Assuming the backend returns the URL of the uploaded image
            setPhotoURLs([imageUrl, ...photoURLs.slice(1)]); // Update the reference photo URL
            console.log("Reference photo uploaded:", imageUrl);
          })
          .catch(error => {
            console.error("Error uploading image:", error);
          });
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="create-advert-container">
      <div className="create-left-card">
        <div className="image-window">
          <img src={photoURLs[0]} alt="Referencia" className="reference-img" />
        </div>
        <h3 className="reference-caption">Foto de Referencia</h3>
        <input type="file" accept="image/*" className="upload-input" onChange={uploadReferencePhoto} />
        <h2>Otras fotos</h2>
        <button className="upload-button">Subir imagen</button>
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
          {selectingTags && <TagDialogue onConfirm={confirmTags} />}
          <button>Publicar</button>
      </div>
    </div>
  );
}
