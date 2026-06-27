import square_placeholder from "../../assets/square_placeholder.jpeg";
import TagDialogue from "./TagDialogue";
import "./CreateAdvert.css";
import { useState } from "react";

export default function CreateAdvert({onPublish}) {
  const  [selectingTags, setSelectingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [photoURLs, setPhotoURLs] = useState([square_placeholder]); // first is reference photo, rest are additional photos
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  const confirmTags = (tags) => {
    setSelectingTags(false);
    setSelectedTags(tags);
  }

  const uploadPhotos = async (files) => {
    const readPromises = []
    for (const file of files) {
      const reader = new FileReader();
      readPromises.push(new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      }));
    }
    const urls = await Promise.all(readPromises);
    const form = new FormData();
    for (const file of files) {
      form.append("files", file);
    }
    const response = await fetch("http://localhost:8000/productos/imagenes/temporales", {
      method: "POST",
      body: form
    });
    return (await response.json())["urls"]
  }

  const uploadReferencePhoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const urls = await uploadPhotos([file]);
    setPhotoURLs((currentURLs) => [urls[0], ...currentURLs.slice(1)]);
  }

  const uploadAdditionalPhotos = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const urls = await uploadPhotos(files);
    setPhotoURLs((currentURLs) => [...currentURLs, ...urls]);
  }

  const moveAdditionalPhoto = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    setPhotoURLs((currentURLs) => {
      const updatedURLs = [...currentURLs];
      const [movedPhoto] = updatedURLs.splice(fromIndex, 1);
      updatedURLs.splice(toIndex, 0, movedPhoto);
      return updatedURLs;
    });
  }

  const handlePhotoDragStart = (index) => {
    setDraggedPhotoIndex(index + 1);
  }

  const handlePhotoDragOver = (event) => {
    event.preventDefault();
  }

  const handlePhotoDrop = (index) => {
    if (draggedPhotoIndex === null) return;

    const fromIndex = draggedPhotoIndex;
    const toIndex = index + 1;
    setDraggedPhotoIndex(null);
    moveAdditionalPhoto(fromIndex, toIndex);
  }

  const handlePhotoDragEnd = () => {
    setDraggedPhotoIndex(null);
  }

  const publish=async () => {
    const producto = {
      name,
      description,
      quantity,
      price,
      tags: selectedTags,
      photos: photoURLs
    }
    const response = await fetch("http://localhost:8000/productos/",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(producto)
    });
    if (response.ok) {
      alert("Producto publicado exitosamente");
      onPublish();
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
        <input type="file" accept="image/*" multiple className="upload-input" onChange={uploadAdditionalPhotos} />
        <div className="additional-photos">
          {photoURLs.slice(1).map((url, index) => (
            <button
              key={url}
              type="button"
              className="additional-photo-btn"
              draggable
              onDragStart={() => handlePhotoDragStart(index)}
              onDragOver={handlePhotoDragOver}
              onDrop={() => handlePhotoDrop(index)}
              onDragEnd={handlePhotoDragEnd}
            >
              <img src={url} alt={`Foto adicional ${index + 1}`} className="additional-img" />
            </button>
          ))}
        </div>
      </div>

      <div className="create-right-card">
        <h2 className="create-title">Nueva Pieza</h2>
          <label className="form-label">
            Nombre
            <input className="text-input" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="form-label">
            Descripción del producto
            <textarea className="textarea-input" name="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <label className="form-label">
            Cantidad Disponible
            <input className="text-input" type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
          </label>
          <label className="form-label">
            Precio
            <input className="text-input" type="number" name="price" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
          </label>
          <label className="form-label">
            Palabras Clave
          </label>
          <button onClick={() => setSelectingTags(true)}>
            Seleccionar
          </button>
          {selectingTags && <TagDialogue onConfirm={confirmTags} />}
          <button onClick={publish}>Publicar</button>
      </div>
    </div>
  );
}
