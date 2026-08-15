import TagDialogue from "./TagDialogue";
import "./CreateAdvert.css";
import { useState,useContext } from "react";
import "@/buttons.css"
import ApiContext from "@/context/ApiContext";

const formatThousands = (digits) => {
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


export default function CreateAdvert({onPublish,editingProduct,switchShow}) {
  const [selectingTags, setSelectingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState(editingProduct ? editingProduct.tags : []);
  const [photoURLs, setPhotoURLs] = useState(editingProduct ? editingProduct.photos : []); // first is reference photo, rest are additional photos
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState(null);
  const [name, setName] = useState(editingProduct ? editingProduct.name : "");
  const [description, setDescription] = useState(editingProduct ? editingProduct.description : "");
  const [quantity, setQuantity] = useState(editingProduct ? editingProduct.quantity : 0);
  const [size, setSize] = useState(editingProduct ? editingProduct.size : "");
  const [materialInput, setMaterialInput] = useState("");
  const [materials, setMaterials] = useState(
    editingProduct ? (editingProduct.materials ? 
      editingProduct.materials : []) :
     []
  );
  const [price, setPrice] = useState(editingProduct ? editingProduct.price : 0);
  const [priceInput, setPriceInput] = useState(editingProduct ? formatThousands(editingProduct.price.toString()) : "");
  const [category, setCategory] = useState(editingProduct ? editingProduct.category : "");
  const [visibilidadAnuncio, setVisibilidadAnuncio] = useState(
      editingProduct?.oculto ? "oculto" : "visible"
  );
  const { apiUrl } = useContext(ApiContext);

  const handlePriceChange = (event) => {
    const rawValue = event.target.value.replace(/[^\d]/g, "");
    if (rawValue === "") {
      setPriceInput("");
      setPrice(0);
      return;
    }

    setPriceInput(formatThousands(rawValue));
    setPrice(Number(rawValue));
  }

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
    const response = await fetch(`${apiUrl}/productos/imagenes/temporales`, {
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

  const removeAdditionalPhoto = (index) => {
    setPhotoURLs((currentURLs) => currentURLs.filter((_, currentIndex) => currentIndex !== index + 1))
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

  const removeTag = (tagToRemove) => {
    setSelectedTags((currentTags) => currentTags.filter((tag) => tag !== tagToRemove));
  }

  const addMaterial = () => {
    const nextMaterial = materialInput.trim();
    if (!nextMaterial || materials.includes(nextMaterial)) return;

    setMaterials((currentMaterials) => [...currentMaterials, nextMaterial]);
    setMaterialInput("");
  }

  const removeMaterial = (materialToRemove) => {
    setMaterials((currentMaterials) => currentMaterials.filter((material) => material !== materialToRemove));
  }

  const handleMaterialKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addMaterial();
    }
  }

  const publish=async () => {
    if (!name || !description || !category || price <= 0 || photoURLs.length === 0 || quantity <= 0 || !visibilidadAnuncio) {
      alert("Por favor, complete todos los campos requeridos.");
      return;
    }

    if (editingProduct) {
      const producto = editingProduct;
      producto.name = name;
      producto.description = description;
      producto.quantity = quantity;
      producto.size = size;
      producto.materials = materials;
      producto.price = price;
      producto.category = category;
      producto.tags = selectedTags;
      producto.photos = photoURLs;
      producto.oculto = visibilidadAnuncio === "oculto";
      
      const response = await fetch(`${apiUrl}/productos/${producto.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
      });
      if (response.ok) {
        alert("Producto actualizado exitosamente");
        onPublish();
      }
    }
    else{
      const producto = {
            name,
            description,
            quantity,
            size,
            materials,
            price,
            category,
            tags: selectedTags,
            photos: photoURLs,
          }
          const response = await fetch(`${apiUrl}/productos/`,{
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
  }

  return (
    <div className="create-advert-container">
      <div className="create-left-card">
        <input id="reference-photo-input" type="file" accept="image/*" className="upload-input" onChange={uploadReferencePhoto} />
        <input id="additional-photos-input" type="file" accept="image/*" multiple className="upload-input" onChange={uploadAdditionalPhotos} />
        <div className="image-window">
          {
            photoURLs.length > 0 ? <img src={photoURLs[0]} alt="Referencia" className="reference-img"/> : <p>Sube una foto de referencia y aparecerá aquí</p>
          }
        </div>
        <h3 className="reference-caption">Foto de Referencia *</h3>
        <label htmlFor="reference-photo-input" className="btn btn-primary upload-btn"> {photoURLs.length > 0 ? "Cambiar foto de referencia" : "Subir foto de referencia"}</label>
        <h2>Otras fotos</h2>
        <label htmlFor="additional-photos-input" className="btn btn-primary upload-btn">Subir fotos extra</label>
        <div className="additional-photos">
          {photoURLs.slice(1).map((url, index) => (
            <div
              key={url}
              className="additional-photo-btn"
              draggable
              onDragStart={() => handlePhotoDragStart(index)}
              onDragOver={handlePhotoDragOver}
              onDrop={() => handlePhotoDrop(index)}
              onDragEnd={handlePhotoDragEnd}
            >
              <img src={url} alt={`Foto adicional ${index + 1}`} className="additional-img" />
              <button
                type="button"
                className="additional-photo-remove"
                aria-label={`Eliminar foto adicional ${index + 1}`}
                onClick={() => removeAdditionalPhoto(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="create-right-card">
        <h2 className="create-title">Nueva Pieza</h2>
          <label className="form-label">
            Nombre *
            <input className="text-input" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="form-label">
            Descripción del producto *
            <textarea className="textarea-input" name="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <label className="form-label">
            Cantidad Disponible *
            <input className="text-input" type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
          </label>
          <label className="form-label">
            Tamaño
            <input className="text-input" type="text" name="size" value={size} onChange={(e) => setSize(e.target.value)} />
          </label>
          <label className="form-label">
            Materiales
            <div className="materials-input-row">
              <input
                className="text-input materials-input"
                type="text"
                name="materials"
                value={materialInput}
                onChange={(e) => setMaterialInput(e.target.value)}
                onKeyDown={handleMaterialKeyDown}
                placeholder="Escribe un material y agrégalo"
              />
              <button type="button" className="materials-add-btn" onClick={addMaterial}>
                Agregar
              </button>
            </div>
          </label>
          <div className="materials-list">
            {materials.map((material) => (
              <span className="selected-tag-chip" key={material}>
                <span>{material}</span>
                <button
                  type="button"
                  className="selected-tag-remove"
                  aria-label={`Quitar ${material}`}
                  onClick={() => removeMaterial(material)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <label className="form-label">
            Precio *
            <input
              className="text-input"
              type="text"
              inputMode="decimal"
              name="price"
              value={priceInput}
              onChange={handlePriceChange}
            />
          </label>
          <label className="form-label">
            Categoría *
            <select className="text-input category-select" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Selecciona una categoría</option>
              <option value="collares">Collares</option>
              <option value="manillas">Manillas</option>
              <option value="aretes">Aretes</option>
            </select>
          </label>
          <label className="form-label"> 
          Visibilidad del Anuncio *
          </label>
          <label className="radio-input form-label">
            <input  className="radio-btn"
                type="radio"
                name="visibilidad"
                value="visible"
                checked={visibilidadAnuncio === "visible"}
                onChange={() => setVisibilidadAnuncio("visible")}
            />
            Visible
            <input  className="radio-btn"
                type="radio"
                name="visibilidad"
                value="oculto"
                checked={visibilidadAnuncio === "oculto"}
                onChange={() => setVisibilidadAnuncio("oculto")}
            />
            Oculto
          </label>
          <label className="form-label">
            Palabras Clave
          </label>
          <div className="selected-tags-list">
            {selectedTags.map((tag) => (
              <span className="selected-tag-chip" key={tag}>
                <span>{tag}</span>
                <button
                  type="button"
                  className="selected-tag-remove"
                  aria-label={`Quitar ${tag}`}
                  onClick={() => removeTag(tag)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button onClick={() => setSelectingTags(true)} className="select-tags-btn">
            Agregar palabras clave
          </button>
          {selectingTags && <TagDialogue initialSelectedTags={selectedTags} onConfirm={confirmTags} />}
          <button onClick={publish} className={"btn btn-primary publish-btn"}>
            {editingProduct ? "Guardar Cambios" : "Publicar Pieza"}
          </button>
      </div>
    </div>
  );
}
