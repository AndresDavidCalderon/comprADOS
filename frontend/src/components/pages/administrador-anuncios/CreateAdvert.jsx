import TagDialogue from "./TagDialogue";
import "./CreateAdvert.css";
import { useState,useContext } from "react";
import "@/buttons.css"
import ApiContext from "@/context/ApiContext";

const formatThousands = (digits) => {
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


export default function CreateAdvert({onPublish,editingProduct}) {
  const [selectingTags, setSelectingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState(editingProduct ? editingProduct.tags : []);
  const [name, setName] = useState(editingProduct ? editingProduct.name : "");
  const [description, setDescription] = useState(editingProduct ? editingProduct.description : "");
  const [materialInput, setMaterialInput] = useState("");
  const [materials, setMaterials] = useState(
    editingProduct ? (editingProduct.materials ? 
      editingProduct.materials : []) :
     []
  );
  const [price, setPrice] = useState(editingProduct ? editingProduct.price : 0);
  const [priceInput, setPriceInput] = useState(editingProduct ? formatThousands(editingProduct.price.toString()) : "");
  const [category, setCategory] = useState(editingProduct ? editingProduct.category : "");
  const [variants, setVariants] = useState(() => editingProduct?.variants?.length
    ? editingProduct.variants.map((variant) => ({ ...variant }))
    : [{ variant_type: "Unica", quantity: 0, photos: [], description_override: null, price_override: null, materials_override: null, is_showcase: true }]
  );
  const [visibilidadAnuncio, setVisibilidadAnuncio] = useState(editingProduct?.is_hidden ? "oculto" : "visible");
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
    const form = new FormData();
    for (const file of files) {
      form.append("files", file);
    }
    const response = await fetch(`${apiUrl}/productos/imagenes/temporales`, {
      method: "POST",
      body: form
    });
    if (!response.ok) throw new Error("No se pudieron subir las imágenes.");
    return (await response.json()).urls;
  }

  const updateVariant = (index, updates) => {
    setVariants((current) => current.map((variant, currentIndex) =>
      currentIndex === index ? { ...variant, ...updates } : variant
    ));
  }

  const uploadVariantPhotos = async (index, event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const urls = await uploadPhotos(files);
    setVariants((current) => current.map((variant, currentIndex) =>
      currentIndex === index ? { ...variant, photos: [...variant.photos, ...urls] } : variant
    ));
    event.target.value = "";
  }

  const removeVariantPhoto = (variantIndex, photoIndex) => {
    setVariants((current) => current.map((variant, index) => index === variantIndex
      ? { ...variant, photos: variant.photos.filter((_, currentPhotoIndex) => currentPhotoIndex !== photoIndex) }
      : variant
    ));
  }

  const addVariant = () => {
    setVariants((current) => [...current, {
      variant_type: "",
      quantity: 0,
      photos: [],
      description_override: null,
      price_override: null,
      materials_override: null,
      is_showcase: false,
    }]);
  }

  const removeVariant = (index) => {
    setVariants((current) => {
      if (current.length === 1) return current;
      const remaining = current.filter((_, currentIndex) => currentIndex !== index);
      if (!remaining.some((variant) => variant.is_showcase)) remaining[0].is_showcase = true;
      return remaining;
    });
  }

  const toggleOverride = (index, field, enabled) => {
    const defaults = {
      description_override: description,
      price_override: price,
      materials_override: [...materials],
    };
    updateVariant(index, { [field]: enabled ? defaults[field] : null });
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
    if (!name.trim() || !description.trim() || !category || price <= 0 || variants.length === 0 || !visibilidadAnuncio) {
      alert("Por favor, complete todos los campos requeridos.");
      return;
    }

    if (variants.some((variant) => !variant.variant_type.trim() || variant.quantity < 0 || variant.photos.length === 0)) {
      alert("Cada variante debe tener un nombre o color, una cantidad válida y al menos una foto.");
      return;
    }

    if (variants.filter((variant) => variant.is_showcase).length !== 1) {
      alert("Selecciona una variante de escaparate.");
      return;
    }

    const productData = {
      name,
      description,
      price,
      category,
      materials,
      is_hidden: visibilidadAnuncio === "oculto",
      tags: selectedTags,
      variants,
    };
    const payload = { producto: productData, token: localStorage.getItem('token') };

    try {
      const response = await fetch(`${apiUrl}/productos/${editingProduct ? `${editingProduct.id}` : ""}`, {
        method: editingProduct ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("No se pudo guardar el producto.");
      alert(editingProduct ? "Producto actualizado exitosamente" : "Producto publicado exitosamente");
      onPublish();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="create-advert-container">
      <div className="create-right-card">
        <h2 className="create-title">{editingProduct ? "Editar Pieza" : "Nueva Pieza"}</h2>
          <label className="form-label">
            Nombre *
            <input className="text-input" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="form-label">
            Descripción del producto *
            <textarea className="textarea-input" name="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <label className="form-label">
            Precio base *
            <input className="text-input" type="text" inputMode="decimal" name="price" value={priceInput} onChange={handlePriceChange} />
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
            Categoría *
            <select className="text-input category-select" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Selecciona una categoría</option>
              <option value="collares">Collares</option>
              <option value="manillas">Manillas</option>
              <option value="aretes">Aretes</option>
            </select>
          </label>

          <div className="variant-editor-list">
            <div className="variant-editor-list-heading">
              <h3>Variantes</h3>
              <button type="button" className="materials-add-btn" onClick={addVariant}>Agregar variante</button>
            </div>
            {variants.map((variant, index) => (
              <section className="variant-editor" key={variant.id ?? `new-${index}`}>
                <div className="variant-editor-heading">
                  <h4>Variante {index + 1}</h4>
                  <label className="showcase-choice">
                    <input
                      type="radio"
                      name="showcase-variant"
                      checked={variant.is_showcase}
                      onChange={() => setVariants((current) => current.map((item, itemIndex) => ({ ...item, is_showcase: itemIndex === index })))}
                    />
                    Foto de escaparate
                  </label>
                  {variants.length > 1 && (
                    <button type="button" className="selected-tag-remove" aria-label={`Eliminar variante ${index + 1}`} onClick={() => removeVariant(index)}>×</button>
                  )}
                </div>
                <label className="form-label">
                  Nombre o color *
                  <input className="text-input" value={variant.variant_type} onChange={(event) => updateVariant(index, { variant_type: event.target.value })} />
                </label>
                <label className="form-label">
                  Cantidad disponible *
                  <input className="text-input" type="number" min="0" value={variant.quantity} onChange={(event) => updateVariant(index, { quantity: Number(event.target.value) })} />
                </label>
                <label className="form-label">
                  Fotos de la variante *
                  <input className="text-input" type="file" accept="image/*" multiple onChange={(event) => uploadVariantPhotos(index, event)} />
                </label>
                <div className="additional-photos">
                  {variant.photos.map((photo, photoIndex) => (
                    <div className="additional-photo-btn" key={`${photo}-${photoIndex}`}>
                      <img src={photo} alt={`Variante ${index + 1}, foto ${photoIndex + 1}`} className="additional-img" />
                      <button type="button" className="additional-photo-remove" aria-label={`Eliminar foto ${photoIndex + 1}`} onClick={() => removeVariantPhoto(index, photoIndex)}>×</button>
                    </div>
                  ))}
                </div>
                <label className="variant-override-toggle">
                  <input type="checkbox" checked={variant.description_override !== null} onChange={(event) => toggleOverride(index, "description_override", event.target.checked)} />
                  Usar descripción propia
                </label>
                {variant.description_override !== null && (
                  <label className="form-label">
                    Descripción de la variante
                    <textarea className="textarea-input" rows="3" value={variant.description_override} onChange={(event) => updateVariant(index, { description_override: event.target.value })} />
                  </label>
                )}
                <label className="variant-override-toggle">
                  <input type="checkbox" checked={variant.price_override !== null} onChange={(event) => toggleOverride(index, "price_override", event.target.checked)} />
                  Usar precio propio
                </label>
                {variant.price_override !== null && (
                  <label className="form-label">
                    Precio de la variante
                    <input className="text-input" type="number" min="0" step="1" value={variant.price_override} onChange={(event) => updateVariant(index, { price_override: event.target.value === "" ? null : Number(event.target.value) })} />
                  </label>
                )}
                <label className="variant-override-toggle">
                  <input type="checkbox" checked={variant.materials_override !== null} onChange={(event) => toggleOverride(index, "materials_override", event.target.checked)} />
                  Usar materiales propios
                </label>
                {variant.materials_override !== null && (
                  <label className="form-label">
                    Materiales de la variante (separados por coma)
                    <input
                      className="text-input"
                      value={variant.materials_override.join(", ")}
                      onChange={(event) => updateVariant(index, { materials_override: event.target.value.split(",").map((material) => material.trim()).filter(Boolean) })}
                    />
                  </label>
                )}
              </section>
            ))}
          </div>

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
