import FieldTitle from "./FieldTitle";

export default function VariantEditor({ values, actions }) {
  const {
    variants,
    selectedVariant,
    activeVariantIndex,
    variantKind,
    hasMultipleVariants,
    priceIsOwn,
    descriptionIsOwn,
    materialsAreOwn,
    effectiveDescription,
    variantMaterials,
    priceInput,
    materialInput,
  } = values;
  const {
    addVariant,
    removeVariant,
    selectVariant,
    setVariantProperty,
    setVariantOverride,
    handlePriceChange,
    setMaterialInput,
    handleMaterialKeyDown,
    addMaterial,
    removeMaterial,
  } = actions;

  return (
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
              onClick={() => selectVariant(index)}
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
                      onChange={(event) => setVariantProperty("variant_type", event.target.value)}
                      title="Elige el color de esta variante."
                    />
                    <span>{selectedVariant.variant_type}</span>
                  </div>
                ) : (
                  <input
                    className="text-input"
                    value={selectedVariant.variant_type}
                    onChange={(event) => setVariantProperty("variant_type", event.target.value)}
                    title="Escribe el nombre que identifica esta variante."
                  />
                )}
              </label>
            </>
          )}

          <div className="variant-field">
            <FieldTitle icon="inventory_2" title="Cantidad disponible" required />
            <input
              className="text-input"
              type="number"
              min="0"
              value={selectedVariant.quantity}
              onChange={(event) => setVariantProperty("quantity", event.target.value)}
              title="Indica la cantidad disponible de esta variante."
            />
          </div>

          <div className="variant-field">
            <FieldTitle
              icon="payments"
              title="Precio (COP)"
              onSetOverride={hasMultipleVariants ? (override) => setVariantOverride("price", override) : undefined}
              overriden={priceIsOwn}
              required
            />
            {priceIsOwn ? (
              <input
                className="text-input"
                type="number"
                min="0"
                step="1"
                value={selectedVariant.price_override}
                onChange={(event) => setVariantProperty("price", event.target.value === "" ? "" : Number(event.target.value))}
                title="Indica el precio de esta variante en pesos colombianos."
              />
            ) : (
              <input
                className="text-input"
                type="text"
                inputMode="decimal"
                value={priceInput}
                onChange={handlePriceChange}
                title="Indica el precio base en pesos colombianos."
              />
            )}
          </div>

          <div className="variant-field">
            <FieldTitle
              icon="description"
              title="Descripción"
              onSetOverride={hasMultipleVariants ? (override) => setVariantOverride("description", override) : undefined}
              overriden={descriptionIsOwn}
              required
            />
            <textarea
              className="textarea-input"
              rows="3"
              value={effectiveDescription}
              onChange={(event) => setVariantProperty("description", event.target.value)}
              title={descriptionIsOwn ? "Escribe la descripción de esta variante." : "Escribe la descripción base compartida por las variantes."}
            />
          </div>

          <div className="variant-field">
            <FieldTitle
              icon="garden_cart"
              title="Materiales"
              onSetOverride={hasMultipleVariants ? (override) => setVariantOverride("materials", override) : undefined}
              overriden={materialsAreOwn}
            />
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
                onChange={(event) => setVariantProperty("is_showcase", event.target.checked)}
              />
              <span className="material-symbols-outlined" aria-hidden="true">{selectedVariant.is_showcase ? "check_box" : "check_box_outline_blank"}</span>
              Variante de muestra
            </label>
          )}
        </div>
      )}
    </section>
  );
}
