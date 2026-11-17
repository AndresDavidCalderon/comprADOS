import FieldTitle from "./FieldTitle";
import TagDialogue from "./TagDialogue";

export default function ProductFieldsEditor({
  draft,
  selectingTags,
  onChange,
  onOpenTags,
  onConfirmTags,
  onRemoveTag,
}) {
  return (
    <>
      <label className="form-label">
        <FieldTitle className="field-title" icon="sell" title="Nombre" required />
        <input
          className="text-input"
          type="text"
          name="name"
          value={draft.name}
          onChange={(event) => onChange("name", event.target.value)}
          title="Escribe el nombre con el que se mostrará la pieza."
        />
      </label>

      <label className="form-label">
        <FieldTitle className="field-title" icon="category" title="Categoría" required />
        <select
          className="text-input category-select"
          name="category"
          value={draft.category}
          onChange={(event) => onChange("category", event.target.value)}
          title="Selecciona la categoría donde aparecerá la pieza."
        >
          <option value="">Selecciona una categoría</option>
          <option value="collares">Collares</option>
          <option value="manillas">Manillas</option>
          <option value="aretes">Aretes</option>
        </select>
      </label>

      <div className="advert-settings">
        <div className="advert-visibility">
          <span className="field-title"><span className="material-symbols-outlined" aria-hidden="true">visibility</span>Visibilidad del anuncio *</span>
          <div>
            <label>
              <input
                type="radio"
                name="visibilidad"
                checked={!draft.is_hidden}
                onChange={() => onChange("is_hidden", false)}
                title="El anuncio será visible en el catálogo."
              />
              Visible
            </label>
            <label>
              <input
                type="radio"
                name="visibilidad"
                checked={draft.is_hidden}
                onChange={() => onChange("is_hidden", true)}
                title="El anuncio quedará oculto para los clientes."
              />
              Oculto
            </label>
          </div>
        </div>

        <div className="tag-field">
          <span className="field-title"><span className="material-symbols-outlined" aria-hidden="true">sell</span>Palabras clave</span>
          <div className="selected-tags-list">
            {draft.tags.map((tag) => (
              <span className="selected-tag-chip" key={tag}>
                <span>{tag}</span>
                <button
                  type="button"
                  className="selected-tag-remove"
                  aria-label={`Quitar ${tag}`}
                  title={`Quitar la palabra clave ${tag}`}
                  onClick={() => onRemoveTag(tag)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={onOpenTags}
            className="select-tags-btn"
            title="Abre el selector para agregar palabras clave al anuncio."
          >
            Agregar palabras clave
          </button>
        </div>
      </div>

      {selectingTags && (
        <TagDialogue initialSelectedTags={draft.tags} onConfirm={onConfirmTags} />
      )}
    </>
  );
}
