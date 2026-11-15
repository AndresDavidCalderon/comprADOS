import TagDialogue from "./TagDialogue";
import "./CreateAdvert.css";
import { useState,useContext } from "react";
import "@/buttons.css"
import ApiContext from "@/context/ApiContext";
import FieldTitle from "./FieldTitle";

const formatThousands = (digits) => {
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


export default function CreateAdvert({onPublish,editingProduct}) {
  const singleExistingVariant = editingProduct?.variants?.length === 1 ? editingProduct.variants[0] : null;
  const [selectingTags, setSelectingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState(editingProduct ? editingProduct.tags : []);
  const [name, setName] = useState(editingProduct ? editingProduct.name : "");
  const [description, setDescription] = useState(singleExistingVariant?.description ?? editingProduct?.description ?? "");
  const [materialInput, setMaterialInput] = useState("");
  const [materials, setMaterials] = useState(
    singleExistingVariant?.materials ?? editingProduct?.materials ?? []
  );
  const [price, setPrice] = useState(singleExistingVariant?.price ?? editingProduct?.price ?? 0);
  const [priceInput, setPriceInput] = useState(singleExistingVariant || editingProduct
    ? formatThousands(String(singleExistingVariant?.price ?? editingProduct.price))
    : "");
  const [category, setCategory] = useState(editingProduct ? editingProduct.category : "");
  const [variants, setVariants] = useState(() => editingProduct?.variants?.length
    ? editingProduct.variants.map((variant) => ({
      ...variant,
      quantity_override: editingProduct.variants.length === 1 ? false : variant.quantity_override ?? true,
      description_override: editingProduct.variants.length === 1 ? null : variant.description_override ?? null,
      price_override: editingProduct.variants.length === 1 ? null : variant.price_override ?? null,
      materials_override: editingProduct.variants.length === 1 ? null : variant.materials_override ?? null,
    }))
    : [{ variant_type: "Unica", quantity: 0, quantity_override: false, photos: [], description_override: null, price_override: null, materials_override: null, is_showcase: true }]
  );
  const [baseQuantity, setBaseQuantity] = useState(() => Number(
    singleExistingVariant?.quantity ??
    editingProduct?.variants?.find((variant) => variant.quantity_override === false)?.quantity ??
    0
  ));
  const [variantKind, setVariantKind] = useState(() => {
    if ((editingProduct?.variants?.length ?? 0) < 2) return null;
    if (editingProduct.variant_kind === "color" || editingProduct.variant_kind === "name") {
      return editingProduct.variant_kind;
    }
    const firstVariantType = editingProduct?.variants?.[0]?.variant_type ?? "";
    if (/^#[0-9a-f]{6}$/i.test(firstVariantType)) return "color";
    return "name";
  });
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(() => {
    const showcaseIndex = editingProduct?.variants?.findIndex((variant) => variant.is_showcase) ?? -1;
    return showcaseIndex >= 0 ? showcaseIndex : 0;
  });
  const [choosingVariantKind, setChoosingVariantKind] = useState(false);
  const [visibilidadAnuncio, setVisibilidadAnuncio] = useState(editingProduct?.is_hidden ? "oculto" : "visible");
  const { apiUrl } = useContext(ApiContext);
  const selectedVariant = variants[selectedVariantIndex] ?? variants[0];
  const activeVariantIndex = variants[selectedVariantIndex] ? selectedVariantIndex : 0;
  const hasMultipleVariants = variants.length > 1;

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
    const input = event.currentTarget;
    const files = input.files;
    if (!files || files.length === 0) return;
    try {
      const urls = await uploadPhotos(files);
      setVariants((current) => current.map((variant, currentIndex) =>
        currentIndex === index ? { ...variant, photos: [...variant.photos, ...urls] } : variant
      ));
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudieron subir las imágenes.");
    } finally {
      input.value = "";
    }
  }

  const removeVariantPhoto = (variantIndex, photoIndex) => {
    setVariants((current) => current.map((variant, index) => index === variantIndex
      ? { ...variant, photos: variant.photos.filter((_, currentPhotoIndex) => currentPhotoIndex !== photoIndex) }
      : variant
    ));
  }

  const setPrimaryVariantPhoto = (variantIndex, photoIndex) => {
    setVariants((current) => current.map((variant, index) => {
      if (index !== variantIndex) return variant;
      const photos = [...variant.photos];
      photos.unshift(...photos.splice(photoIndex, 1));
      return { ...variant, photos };
    }));
  }

  const createVariant = (kind) => {
    const newVariant = {
      variant_type: kind === "color" ? "#d9d9d9" : "",
      quantity: baseQuantity,
      quantity_override: false,
      photos: [],
      description_override: null,
      price_override: null,
      materials_override: null,
      is_showcase: false,
    };
    const newIndex = variants.length;
    setVariants((current) => {
      const currentVariants = current.map((variant, index) => {
        if (index !== 0) return variant;
        if (kind === "color") {
          return {
            ...variant,
            variant_type: /^#[0-9a-f]{6}$/i.test(variant.variant_type) ? variant.variant_type : "#d9d9d9",
          };
        }
        return { ...variant, variant_type: variant.variant_type === "Unica" ? "" : variant.variant_type };
      });
      return [...currentVariants, newVariant];
    });
    setSelectedVariantIndex(newIndex);
  }

  const addVariant = () => {
    if (variants.length === 1 || !variantKind) {
      setChoosingVariantKind(true);
      return;
    }
    createVariant(variantKind);
  }

  const chooseVariantKind = (kind) => {
    setVariantKind(kind);
    setChoosingVariantKind(false);
    createVariant(kind);
  }

  const removeVariant = (index) => {
    if (variants.length === 1) return;
    let remaining = variants.filter((_, currentIndex) => currentIndex !== index);
    if (!remaining.some((variant) => variant.is_showcase)) {
      remaining = remaining.map((variant, currentIndex) => ({ ...variant, is_showcase: currentIndex === 0 }));
    }
    if (remaining.length === 1) {
      const [onlyVariant] = remaining;
      const nextPrice = onlyVariant.price_override ?? price;
      setPrice(nextPrice);
      setPriceInput(formatThousands(String(nextPrice)));
      setDescription(onlyVariant.description_override ?? description);
      setMaterials(onlyVariant.materials_override ?? materials);
      setBaseQuantity(onlyVariant.quantity);
      remaining[0] = {
        ...onlyVariant,
        variant_type: "Unica",
        quantity_override: false,
        description_override: null,
        price_override: null,
        materials_override: null,
      };
      setVariantKind(null);
    }
    setVariants(remaining);
    setSelectedVariantIndex((current) => {
      if (current === index) return Math.max(0, index - 1);
      return current > index ? current - 1 : current;
    });
  }

  const toggleOverride = (index, field, enabled) => {
    if (field === "quantity_override") {
      updateVariant(index, {
        quantity_override: enabled,
        quantity: enabled ? variants[index].quantity : baseQuantity,
      });
      return;
    }
    const defaults = {
      description_override: description,
      price_override: price,
      materials_override: [...materials],
    };
    updateVariant(index, { [field]: enabled ? defaults[field] : null });
  }

  const updateBaseQuantity = (quantity) => {
    const nextQuantity = Number(quantity);
    setBaseQuantity(nextQuantity);
    setVariants((current) => current.map((variant) => variant.quantity_override
      ? variant
      : { ...variant, quantity: nextQuantity }
    ));
  }

  const removeTag = (tagToRemove) => {
    setSelectedTags((currentTags) => currentTags.filter((tag) => tag !== tagToRemove));
  }

  const addMaterial = () => {
    const nextMaterial = materialInput.trim();
    const variantMaterials = selectedVariant?.materials_override;
    const currentMaterials = variantMaterials ?? materials;
    if (!nextMaterial || currentMaterials.includes(nextMaterial)) return;

    if (variantMaterials !== null && variantMaterials !== undefined) {
      updateVariant(activeVariantIndex, { materials_override: [...variantMaterials, nextMaterial] });
    } else {
      setMaterials((current) => [...current, nextMaterial]);
    }
    setMaterialInput("");
  }

  const removeMaterial = (materialToRemove) => {
    if (selectedVariant?.materials_override !== null && selectedVariant?.materials_override !== undefined) {
      updateVariant(activeVariantIndex, {
        materials_override: selectedVariant.materials_override.filter((material) => material !== materialToRemove),
      });
    } else {
      setMaterials((current) => current.filter((material) => material !== materialToRemove));
    }
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
      variant_kind: hasMultipleVariants ? variantKind : null,
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

  const variantMaterials = selectedVariant?.materials_override ?? materials;
  const quantityIsOwn = selectedVariant?.quantity_override ?? false;
  const priceIsOwn = (selectedVariant?.price_override ?? null) !== null;
  const descriptionIsOwn = (selectedVariant?.description_override ?? null) !== null;
  const materialsAreOwn = (selectedVariant?.materials_override ?? null) !== null;
  const variantPhotos = selectedVariant?.photos ?? [];

  const changeVariantPrice = (event) => {
    const value = event.target.value;
    updateVariant(activeVariantIndex, { price_override: value === "" ? null : Number(value) });
  }

  const changeVariantDescription = (value) => {
    updateVariant(activeVariantIndex, { description_override: value });
  }

  return (
    <div className="create-advert-container">
      <section className="create-image-column" aria-label="Fotos de la variante seleccionada">
        <div className="image-heading-row">
          <h2 className="image-section-title">
            <span className="material-symbols-outlined" aria-hidden="true">alt_route</span>
            Imagen de referencia
          </h2>
          <label className="image-upload-button" title="Agrega fotos a la variante seleccionada.">
            <span className="material-symbols-outlined" aria-hidden="true">alt_route</span>
            <span>Agregar fotos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => uploadVariantPhotos(activeVariantIndex, event)}
              aria-label="Agregar fotos a la variante seleccionada"
            />
          </label>
        </div>
        <div className="reference-image-frame">
          {variantPhotos.length > 0 ? (
            <>
              <img className="reference-img" src={variantPhotos[0]} alt={`Imagen principal de ${name || "la pieza"}`} />
              <button
                type="button"
                className="photo-remove-button primary-photo-remove"
                onClick={() => removeVariantPhoto(activeVariantIndex, 0)}
                title="Quitar la imagen de referencia"
                aria-label="Quitar la imagen de referencia"
              >
                <span className="material-symbols-outlined" aria-hidden="true">delete</span>
              </button>
            </>
          ) : (
            <p className="empty-image-message">Agrega fotos para esta variante con el botón «Agregar fotos».</p>
          )}
        </div>
        <div className="other-images-heading">
          <h3 className="image-section-title">
            <span className="material-symbols-outlined" aria-hidden="true">alt_route</span>
            Otras imágenes
          </h3>
          <span className="image-count">{variantPhotos.length} {variantPhotos.length === 1 ? "foto" : "fotos"}</span>
        </div>
        <div className="reference-thumbnails">
          {variantPhotos.slice(1).map((photo, photoIndex) => (
            <div className="reference-thumbnail-wrap" key={`${photo}-${photoIndex + 1}`}>
              <button
                type="button"
                className="reference-thumbnail"
                onClick={() => setPrimaryVariantPhoto(activeVariantIndex, photoIndex + 1)}
                title="Usar esta foto como imagen de referencia"
                aria-label={`Usar foto ${photoIndex + 2} como imagen de referencia`}
              >
                <img src={photo} alt={`Foto ${photoIndex + 2} de ${name || "la pieza"}`} />
              </button>
              <button
                type="button"
                className="photo-remove-button thumbnail-photo-remove"
                onClick={() => removeVariantPhoto(activeVariantIndex, photoIndex + 1)}
                title={`Quitar foto ${photoIndex + 2}`}
                aria-label={`Quitar foto ${photoIndex + 2}`}
              >
                <span className="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>
          ))}
          {variantPhotos.length === 0 && (
            <p className="empty-thumbnails-message">Las fotos de esta variante aparecerán aquí.</p>
          )}
        </div>
      </section>

      <div className="create-right-card">
        <h2 className="create-title">{editingProduct ? "Editar Pieza" : "Nueva Pieza"}</h2>
        <label className="form-label">
          <span className="field-title"><span className="material-symbols-outlined" aria-hidden="true">sell</span>Nombre *</span>
          <input className="text-input" type="text" name="name" value={name} onChange={(event) => setName(event.target.value)} title="Escribe el nombre con el que se mostrará la pieza." />
        </label>

        <label className="form-label">
          <span className="field-title"><span className="material-symbols-outlined" aria-hidden="true">category</span>Categoría *</span>
          <select className="text-input category-select" name="category" value={category} onChange={(event) => setCategory(event.target.value)} title="Selecciona la categoría donde aparecerá la pieza.">
            <option value="">Selecciona una categoría</option>
            <option value="collares">Collares</option>
            <option value="manillas">Manillas</option>
            <option value="aretes">Aretes</option>
          </select>
        </label>

        <section className="variant-editor-list" aria-label="Ajustes de variantes">
          <div className="variant-editor-list-heading">
            {hasMultipleVariants && <h3>Variantes</h3>}
            <button type="button" className="materials-add-btn" onClick={addVariant} title="Añade otra variante.">
              <span className="material-symbols-outlined" aria-hidden="true">add</span>
              Añadir variante
            </button>
          </div>
          {hasMultipleVariants && (
            <div className="variant-selector" aria-label="Selecciona una variante para editar">
              {variants.map((variant, index) => (
                <button
                  key={variant.id ?? `new-${index}`}
                  type="button"
                  className={`variant-selector-option ${index === activeVariantIndex ? "is-selected" : ""} ${variantKind === "color" ? "is-color" : ""}`}
                  onClick={() => setSelectedVariantIndex(index)}
                  title={`Editar variante ${variant.variant_type || index + 1}`}
                  aria-label={`Editar variante ${variant.variant_type || index + 1}`}
                  aria-pressed={index === activeVariantIndex}
                >
                  {variantKind === "color" ? (
                    <span className="variant-color-dot" style={{ backgroundColor: variant.variant_type || "#d9d9d9" }} />
                  ) : (
                    variant.variant_type || `Variante ${index + 1}`
                  )}
                </button>
              ))}
            </div>
          )}

          {selectedVariant && (
            <div className="variant-editor">
              {hasMultipleVariants && (
                <>
                  <div className="variant-editor-heading">
                    <h4>Variante {activeVariantIndex + 1}</h4>
                  <button
                    type="button"
                    className="icon-action-button"
                    onClick={() => removeVariant(activeVariantIndex)}
                    title={`Eliminar variante ${activeVariantIndex + 1}`}
                    aria-label={`Eliminar variante ${activeVariantIndex + 1}`}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">delete</span>
                  </button>
                  </div>

                  <label className="form-label">
                    <span className="field-title">
                      <span className="material-symbols-outlined" aria-hidden="true">{variantKind === "color" ? "format_color_fill" : "sell"}</span>
                      {variantKind === "color" ? "Color de la variante *" : "Nombre de la variante *"}
                    </span>
                    {variantKind === "color" ? (
                      <div className="color-input-row">
                        <input
                          className="color-input"
                          type="color"
                          value={selectedVariant.variant_type || "#d9d9d9"}
                          onChange={(event) => updateVariant(activeVariantIndex, { variant_type: event.target.value })}
                          title="Elige el color de esta variante."
                        />
                        <span>{selectedVariant.variant_type}</span>
                      </div>
                    ) : (
                      <input
                        className="text-input"
                        value={selectedVariant.variant_type}
                        onChange={(event) => updateVariant(activeVariantIndex, { variant_type: event.target.value })}
                        title="Escribe el nombre que identifica esta variante."
                      />
                    )}
                  </label>
                </>
              )}

              <div className="variant-field">
                <FieldTitle icon="inventory_2" title="Cantidad disponible" onSetOverride={hasMultipleVariants ? () => toggleOverride(activeVariantIndex, "quantity_override", true) : undefined} required={true} />
                <input
                  className="text-input"
                  type="number"
                  min="0"
                  value={quantityIsOwn ? selectedVariant.quantity : baseQuantity}
                  onChange={(event) => quantityIsOwn
                    ? updateVariant(activeVariantIndex, { quantity: Number(event.target.value) })
                    : updateBaseQuantity(event.target.value)}
                  title={quantityIsOwn ? "Indica la cantidad disponible de esta variante." : "Indica la cantidad base compartida por las variantes."}
                />
              </div>

              <div className="variant-field">
                <FieldTitle icon="payments" title="Precio (COP)" onSetOverride={hasMultipleVariants ? () => toggleOverride(activeVariantIndex, "price_override", true) : undefined} required={true} />
                {priceIsOwn ? (
                  <input className="text-input" type="number" min="0" step="1" value={selectedVariant.price_override} onChange={changeVariantPrice} title="Indica el precio de esta variante en pesos colombianos." />
                ) : (
                  <input className="text-input" type="text" inputMode="decimal" value={priceInput} onChange={handlePriceChange} title="Indica el precio base en pesos colombianos." />
                )}
              </div>

              <div className="variant-field">
                <FieldTitle icon="description" title="Descripción" onSetOverride={hasMultipleVariants ? () => toggleOverride(activeVariantIndex, "description_override", true) : undefined} required={true} />
                <textarea
                  className="textarea-input"
                  rows="3"
                  value={descriptionIsOwn ? selectedVariant.description_override : description}
                  onChange={(event) => descriptionIsOwn ? changeVariantDescription(event.target.value) : setDescription(event.target.value)}
                  title={descriptionIsOwn ? "Escribe la descripción de esta variante." : "Escribe la descripción base compartida por las variantes."}
                />
              </div>

              <div className="variant-field">
                <FieldTitle icon="garden_cart" title="Materiales" onSetOverride={hasMultipleVariants ? () => toggleOverride(activeVariantIndex, "materials_override", true) : undefined} />
                <div className="materials-list">
                  {variantMaterials.map((material) => (
                    <span className="selected-tag-chip" key={material}>
                      <span>{material}</span>
                      <button
                        type="button"
                        className="selected-tag-remove"
                        onClick={() => removeMaterial(material)}
                        aria-label={`Quitar ${material}`}
                        title={`Quitar el material ${material}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="materials-input-row">
                  <input
                    className="text-input materials-input"
                    type="text"
                    value={materialInput}
                    onChange={(event) => setMaterialInput(event.target.value)}
                    onKeyDown={handleMaterialKeyDown}
                    placeholder="Agregar material"
                    title="Escribe un material y presiona Enter o el botón Agregar."
                  />
                  <button type="button" className="materials-add-btn" onClick={addMaterial} title="Agrega este material a la variante.">
                    <span className="material-symbols-outlined" aria-hidden="true">add</span>
                  </button>
                </div>
              </div>

              {hasMultipleVariants && (
                <label className="showcase-choice" title="Usa esta variante como la imagen y opción de muestra del anuncio.">
                  <input
                    type="checkbox"
                    checked={selectedVariant.is_showcase}
                    onChange={(event) => setVariants((current) => current.map((variant, index) => ({
                      ...variant,
                      is_showcase: event.target.checked && index === activeVariantIndex,
                    })))}
                  />
                  <span className="material-symbols-outlined" aria-hidden="true">{selectedVariant.is_showcase ? "check_box" : "check_box_outline_blank"}</span>
                  Variante de muestra
                </label>
              )}
            </div>
          )}
        </section>

        <div className="advert-settings">
          <div className="advert-visibility">
            <span className="field-title"><span className="material-symbols-outlined" aria-hidden="true">visibility</span>Visibilidad del anuncio *</span>
            <div>
              <label>
                <input type="radio" name="visibilidad" checked={visibilidadAnuncio === "visible"} onChange={() => setVisibilidadAnuncio("visible")} title="El anuncio será visible en el catálogo." />
                Visible
              </label>
              <label>
                <input type="radio" name="visibilidad" checked={visibilidadAnuncio === "oculto"} onChange={() => setVisibilidadAnuncio("oculto")} title="El anuncio quedará oculto para los clientes." />
                Oculto
              </label>
            </div>
          </div>

          <div className="tag-field">
            <span className="field-title"><span className="material-symbols-outlined" aria-hidden="true">sell</span>Palabras clave</span>
            <div className="selected-tags-list">
              {selectedTags.map((tag) => (
                <span className="selected-tag-chip" key={tag}>
                  <span>{tag}</span>
                  <button type="button" className="selected-tag-remove" aria-label={`Quitar ${tag}`} title={`Quitar la palabra clave ${tag}`} onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
            </div>
            <button onClick={() => setSelectingTags(true)} className="select-tags-btn" title="Abre el selector para agregar palabras clave al anuncio.">
              Agregar palabras clave
            </button>
          </div>
        </div>

        {selectingTags && <TagDialogue initialSelectedTags={selectedTags} onConfirm={confirmTags} />}
        <button onClick={publish} className="btn btn-primary publish-btn" title={editingProduct ? "Guarda los cambios del anuncio." : "Publica la pieza en el catálogo."}>
          {editingProduct ? "Guardar Cambios" : "Publicar Pieza"}
        </button>
      </div>
      {choosingVariantKind && (
        <div className="variant-type-backdrop">
          <section className="variant-type-dialogue" role="dialog" aria-modal="true" aria-labelledby="variant-type-title">
            <h2 id="variant-type-title">¿Cómo quieres que se presenten las variantes de este producto?</h2>
            <button type="button" className="materials-add-btn" onClick={() => chooseVariantKind("color")} title="Crea variantes seleccionando un color.">Por color</button>
            <button type="button" className="materials-add-btn" onClick={() => chooseVariantKind("name")} title="Crea variantes con un nombre personalizado.">Por nombre</button>
          </section>
        </div>
      )}
    </div>
  );
}
