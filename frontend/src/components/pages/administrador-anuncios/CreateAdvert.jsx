import "./CreateAdvert.css";
import { useState,useContext } from "react";
import "@/buttons.css"
import ApiContext from "@/context/ApiContext";
import PhotoListEditor from "./PhotoListEditor";
import ProductFieldsEditor from "./ProductFieldsEditor";
import VariantEditor from "./VariantEditor";

const formatThousands = (digits) => {
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const variantOverrideProperties = {
  description: "description_override",
  materials: "materials_override",
  price: "price_override",
};

const getInitialVariantKind = (product) => {
  if ((product?.variants?.length ?? 0) < 2) return null;
  if (product.variant_kind === "color" || product.variant_kind === "name") {
    return product.variant_kind;
  }
  const firstVariantType = product.variants[0]?.variant_type ?? "";
  return /^#[0-9a-f]{6}$/i.test(firstVariantType) ? "color" : "name";
}


export default function CreateAdvert({onPublish,editingProduct}) {
  const singleExistingVariant = editingProduct?.variants?.length === 1 ? editingProduct.variants[0] : null;
  const [selectingTags, setSelectingTags] = useState(false);
  const [productDraft, setProductDraft] = useState(() => ({
    name: editingProduct?.name ?? "",
    description: singleExistingVariant?.description ?? editingProduct?.description ?? "",
    materials: singleExistingVariant?.materials ?? editingProduct?.materials ?? [],
    price: singleExistingVariant?.price ?? editingProduct?.price ?? 0,
    category: editingProduct?.category ?? "",
    tags: editingProduct?.tags ?? [],
    is_hidden: editingProduct?.is_hidden ?? false,
    variant_kind: getInitialVariantKind(editingProduct),
  }));
  const { name, description, materials, price, category, variant_kind: variantKind } = productDraft;
  const [materialInput, setMaterialInput] = useState("");
  const [priceInput, setPriceInput] = useState(singleExistingVariant || editingProduct
    ? formatThousands(String(singleExistingVariant?.price ?? editingProduct.price))
    : "");
  const [variants, setVariants] = useState(() => editingProduct?.variants?.length
    ? editingProduct.variants.map((variant) => ({
      ...variant,
      description_override: editingProduct.variants.length === 1 ? null : variant.description_override ?? null,
      price_override: editingProduct.variants.length === 1 ? null : variant.price_override ?? null,
      materials_override: editingProduct.variants.length === 1 ? null : variant.materials_override ?? null,
    }))
    : [{ variant_type: "Unica", quantity: 0, photos: [], description_override: null, price_override: null, materials_override: null, is_showcase: true }]
  );
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(() => {
    const showcaseIndex = editingProduct?.variants?.findIndex((variant) => variant.is_showcase) ?? -1;
    return showcaseIndex >= 0 ? showcaseIndex : 0;
  });
  const [choosingVariantKind, setChoosingVariantKind] = useState(false);
  const { apiUrl } = useContext(ApiContext);
  const selectedVariant = variants[selectedVariantIndex] ?? variants[0];
  const activeVariantIndex = variants[selectedVariantIndex] ? selectedVariantIndex : 0;
  const hasMultipleVariants = variants.length > 1;

  const handlePriceChange = (event) => {
    const rawValue = event.target.value.replace(/[^\d]/g, "");
    setVariantProperty("price", rawValue === "" ? "" : Number(rawValue));
  }

  const confirmTags = (tags) => {
    setSelectingTags(false);
    setVariantProperty("tags", tags);
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

  const setVariantProperty = (property, value, { forceProductValue = false, variantIndex = activeVariantIndex } = {}) => {
    const targetVariant = variants[variantIndex];
    const overrideProperty = variantOverrideProperties[property];
    const isOverridden = overrideProperty && targetVariant?.[overrideProperty] !== null && targetVariant?.[overrideProperty] !== undefined;

    if (overrideProperty && isOverridden && !forceProductValue) {
      setVariants((current) => current.map((variant, index) => {
        if (index !== variantIndex) return variant;
        const currentValue = variant[overrideProperty];
        const nextValue = typeof value === "function" ? value(currentValue) : value;
        return {
          ...variant,
          [overrideProperty]: property === "price" && nextValue === "" ? null : nextValue,
        };
      }));
      return;
    }

    if (Object.hasOwn(productDraft, property)) {
      const currentValue = productDraft[property];
      const nextValue = typeof value === "function" ? value(currentValue) : value;
      const productValue = property === "price"
        ? nextValue === "" ? 0 : Number(nextValue)
        : nextValue;
      setProductDraft((current) => ({ ...current, [property]: productValue }));

      if (property === "price") {
        setPriceInput(nextValue === "" ? "" : formatThousands(String(productValue)));
      }
      return;
    }

    if (property === "is_showcase") {
      setVariants((current) => current.map((variant, index) => ({
        ...variant,
        is_showcase: Boolean(value) && index === variantIndex,
      })));
      return;
    }

    setVariants((current) => current.map((variant, index) => {
      if (index !== variantIndex) return variant;
      const nextValue = typeof value === "function" ? value(variant[property]) : value;
      return { ...variant, [property]: property === "quantity" ? Number(nextValue) : nextValue };
    }));
  }

  const setVariantOverride = (property, override, variantIndex = activeVariantIndex) => {
    if (typeof override !== "boolean") {
      throw new TypeError("El override de una variante debe ser true o false.");
    }
    const overrideProperty = variantOverrideProperties[property];
    if (!overrideProperty) {
      throw new RangeError(`La propiedad "${property}" no admite override.`);
    }

    setVariants((current) => current.map((variant, index) => {
      if (index !== variantIndex) return variant;
      return {
        ...variant,
        [overrideProperty]: override
          ? property === "materials" ? [...productDraft[property]] : productDraft[property]
          : null,
      };
    }));
  }

  const uploadVariantPhotos = async (event) => {
    const input = event.currentTarget;
    const files = input.files;
    if (!files || files.length === 0) return;
    try {
      const urls = await uploadPhotos(files);
      setVariantProperty("photos", (current) => [...(current ?? []), ...urls]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudieron subir las imágenes.");
    } finally {
      input.value = "";
    }
  }

  const createVariant = (kind) => {
    const newVariant = {
      variant_type: kind === "color" ? "#d9d9d9" : "",
      quantity: 0,
      photos: [],
      description_override: null,
      price_override: null,
      materials_override: null,
      is_showcase: false,
    };
    const newIndex = variants.length;
    const firstVariantType = variants[0]?.variant_type ?? "";
    const normalizedFirstType = kind === "color"
      ? /^#[0-9a-f]{6}$/i.test(firstVariantType) ? firstVariantType : "#d9d9d9"
      : firstVariantType === "Unica" ? "" : firstVariantType;
    setVariantProperty("variant_type", normalizedFirstType, { variantIndex: 0 });
    setVariants((current) => [...current, newVariant]);
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
    setProductDraft((current) => ({ ...current, variant_kind: kind }));
    setChoosingVariantKind(false);
    createVariant(kind);
  }

  const removeVariant = (index) => {
    if (variants.length === 1) return;
    const remaining = variants.filter((_, currentIndex) => currentIndex !== index);
    if (!remaining.some((variant) => variant.is_showcase)) {
      const newShowcaseIndex = variants.findIndex((_, currentIndex) => currentIndex !== index);
      setVariantProperty("is_showcase", true, { variantIndex: newShowcaseIndex });
    }
    if (remaining.length === 1) {
      const [onlyVariant] = remaining;
      const remainingIndex = index === 0 ? 1 : 0;
      const nextPrice = onlyVariant.price_override ?? price;
      setVariantProperty("price", nextPrice, { forceProductValue: true, variantIndex: remainingIndex });
      setVariantProperty("description", onlyVariant.description_override ?? description, { forceProductValue: true, variantIndex: remainingIndex });
      setVariantProperty("materials", onlyVariant.materials_override ?? materials, { forceProductValue: true, variantIndex: remainingIndex });
      setVariantProperty("variant_type", "Unica", { variantIndex: remainingIndex });
      setVariantOverride("description", false, remainingIndex);
      setVariantOverride("price", false, remainingIndex);
      setVariantOverride("materials", false, remainingIndex);
      setProductDraft((current) => ({ ...current, variant_kind: null }));
    }
    setVariants((current) => current.filter((_, currentIndex) => currentIndex !== index));
    setSelectedVariantIndex((current) => {
      if (current === index) return Math.max(0, index - 1);
      return current > index ? current - 1 : current;
    });
  }

  const removeTag = (tagToRemove) => {
    setVariantProperty("tags", (currentTags) => currentTags.filter((tag) => tag !== tagToRemove));
  }

  const addMaterial = () => {
    const nextMaterial = materialInput.trim();
    if (!nextMaterial || variantMaterials.includes(nextMaterial)) return;
    setVariantProperty("materials", (current) => [...current, nextMaterial]);
    setMaterialInput("");
  }

  const removeMaterial = (materialToRemove) => {
    setVariantProperty("materials", (current) => current.filter((material) => material !== materialToRemove));
  }

  const handleMaterialKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addMaterial();
    }
  }

  const publish=async () => {
    if (!name.trim() || !description.trim() || !category || price <= 0 || variants.length === 0) {
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
      ...productDraft,
      variant_kind: hasMultipleVariants ? variantKind : null,
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
  const priceIsOwn = (selectedVariant?.price_override ?? null) !== null;
  const descriptionIsOwn = (selectedVariant?.description_override ?? null) !== null;
  const materialsAreOwn = (selectedVariant?.materials_override ?? null) !== null;
  const variantPhotos = selectedVariant?.photos ?? [];
  const editorValues = {
    variants,
    selectedVariant,
    activeVariantIndex,
    variantKind,
    hasMultipleVariants,
    priceIsOwn,
    descriptionIsOwn,
    materialsAreOwn,
    effectiveDescription: selectedVariant?.description_override ?? description,
    variantMaterials,
    priceInput,
    materialInput,
  };
  const editorActions = {
    addVariant,
    removeVariant,
    selectVariant: setSelectedVariantIndex,
    setVariantProperty,
    setVariantOverride,
    handlePriceChange,
    setMaterialInput,
    handleMaterialKeyDown,
    addMaterial,
    removeMaterial,
  };

  return (
    <div className="create-advert-container">
      <section className="create-image-column" aria-label="Fotos de la variante seleccionada">
        <PhotoListEditor
          name={name}
          variantPhotos={variantPhotos}
          hasMultipleVariants={hasMultipleVariants}
          onUploadPhotos={uploadVariantPhotos}
          setVariantProperty={setVariantProperty}
        />
      </section>

      <div className="create-right-card">
        <h2 className="create-title">{editingProduct ? "Editar Pieza" : "Nueva Pieza"}</h2>
        <ProductFieldsEditor
          draft={productDraft}
          selectingTags={selectingTags}
          onChange={setVariantProperty}
          onOpenTags={() => setSelectingTags(true)}
          onConfirmTags={confirmTags}
          onRemoveTag={removeTag}
        />
        <VariantEditor values={editorValues} actions={editorActions} />
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
            <button type="button" className="materials-add-btn" onClick={() => setChoosingVariantKind(false)} title="Cierra el diálogo sin agregar una variante.">Cancelar</button>
          </section>
        </div>
      )}
    </div>
  );
}
