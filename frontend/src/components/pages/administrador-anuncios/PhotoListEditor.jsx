export default function PhotoListEditor({
  name,
  variantPhotos,
  hasMultipleVariants,
  onUploadPhotos,
  setVariantProperty,
}) {
  const removePhoto = (photoIndex) => {
    setVariantProperty("photos", (current) => (current ?? []).filter((_, index) => index !== photoIndex));
  };

  const setPrimaryPhoto = (photoIndex) => {
    setVariantProperty("photos", (current) => {
      const photos = [...(current ?? [])];
      photos.unshift(...photos.splice(photoIndex, 1));
      return photos;
    });
  };

  return (
    <div>
      <div className="image-heading-row">
        <h2 className="image-section-title">
          {hasMultipleVariants && <span className="material-symbols-outlined" aria-hidden="true">alt_route</span>}
          Imagen de referencia
        </h2>
        <label className="image-upload-button" title="Agrega fotos a la variante seleccionada.">
          <span className="material-symbols-outlined" aria-hidden="true">add</span>
          <span>Agregar fotos</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onUploadPhotos}
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
              onClick={() => removePhoto(0)}
              title="Quitar la imagen de referencia"
              aria-label="Quitar la imagen de referencia"
            >
              <span className="material-symbols-outlined" aria-hidden="true">delete</span>
            </button>
          </>
        ) : (
          <p className="empty-image-message">
            {hasMultipleVariants
              ? "Agrega fotos para esta variante con el botón «Agregar fotos»."
              : "Agrega fotos para este producto"}
          </p>
        )}
      </div>
      <div className="other-images-heading">
        <h3 className="image-section-title">
          {hasMultipleVariants && <span className="material-symbols-outlined" aria-hidden="true">alt_route</span>}
          Otras imágenes
        </h3>
      </div>
      <div className="reference-thumbnails">
        {variantPhotos.slice(1).map((photo, photoIndex) => (
          <div className="reference-thumbnail-wrap" key={`${photo}-${photoIndex + 1}`}>
            <button
              type="button"
              className="reference-thumbnail"
              onClick={() => setPrimaryPhoto(photoIndex + 1)}
              title="Usar esta foto como imagen de referencia"
              aria-label={`Usar foto ${photoIndex + 2} como imagen de referencia`}
            >
              <img src={photo} alt={`Foto ${photoIndex + 2} de ${name || "la pieza"}`} />
            </button>
            <button
              type="button"
              className="photo-remove-button thumbnail-photo-remove"
              onClick={() => removePhoto(photoIndex + 1)}
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
    </div>
  );
}