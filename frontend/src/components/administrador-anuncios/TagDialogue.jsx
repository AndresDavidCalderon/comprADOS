import { useState } from "react";
import "./TagDialogue.css";

const existingTags = ["Perlado", "Pendiente"];

export default function TagDialogue({
  title = "Nueva Pieza • Palabras Clave",
}) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleTags = existingTags.filter((tag) =>
    tag.toLowerCase().includes(normalizedQuery)
  );

  const shouldShowCreateTag =
    query.trim().length > 0 &&
    !existingTags.some((tag) => tag.toLowerCase() === normalizedQuery);

  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <section className="tag-dialogue" aria-label={title}>
      <h2 className="tag-dialogue-title">{title}</h2>

      <div className="tag-dialogue-section">
        <p className="tag-dialogue-label">Etiquetas añadidas</p>
        <div className="tag-dialogue-chips">
          {selectedTags.map((tag) => (
            <span className="tag-chip" key={tag}>
              <span>{tag}</span>
              <button type="button" className="tag-chip-remove" aria-label={`Quitar ${tag}`} onclick={() => addTag(tag)}>
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <label className="tag-dialogue-input-wrap">
        <span className="tag-dialogue-sr-only">Escribe o elige una etiqueta</span>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="tag-dialogue-input"
          placeholder="Escribe o elige una opción"
        />
      </label>

      <div className="tag-dialogue-panel">
        <p className="tag-dialogue-panel-label">Etiquetas existentes</p>
        <div className="tag-dialogue-suggestions">
          {visibleTags.map((tag) => (
            <button type="button" className="tag-dialogue-suggestion" key={tag}>
              <span className="tag-dialogue-suggestion-mark">+</span>
              <span>{tag}</span>
            </button>
          ))}
        </div>

        {shouldShowCreateTag && (
          <>
            <div className="tag-dialogue-divider" />
            <button type="button" className="tag-dialogue-create">
              + Crea etiqueta "{query.trim()}"
            </button>
          </>
        )}
      </div>

      <button type="button" className="tag-dialogue-apply">
        Agregar
      </button>
    </section>
  );
}