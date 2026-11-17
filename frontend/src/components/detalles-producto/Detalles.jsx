import "./detalles.css"
import DetallesCarousel from "./DetallesCarousel"
import Reviews from "../review/review"
import { useContext, useState } from "react"
import DetallesContext from "../../context/DetallesContext"
import cartContext from "../../context/CartContext"

const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value)

export default function Detalles() {
    const { selectedProduct, closeDetalles } = useContext(DetallesContext)
    const { addToCart, checkOutEnabled } = useContext(cartContext)
    const [variantSelection, setVariantSelection] = useState(null)

    if (!selectedProduct) {
        return null
    }

    const variants = selectedProduct.variants || []
    const showcaseVariant = Number.isInteger(selectedProduct.showcase_variant)
        ? variants[selectedProduct.showcase_variant] || variants.find((variant) => variant.is_showcase) || variants[0]
        : variants.find((variant) => variant.is_showcase) || variants[0]
    const selectedVariant = variantSelection?.productId === selectedProduct.id
        ? variants.find((variant) => variant.id === variantSelection.variantId) || showcaseVariant
        : showcaseVariant
    const displayedProduct = selectedVariant
        ? {
            ...selectedProduct,
            ...selectedVariant,
            description: selectedVariant.description_override ?? selectedProduct.description,
        }
        : selectedProduct
    const selectedCartItem = selectedVariant
        ? { ...selectedProduct, ...selectedVariant, id: selectedVariant.id, product_id: selectedProduct.id, variant_id: selectedVariant.id, name: selectedProduct.name }
        : selectedProduct

    return (
        <div className="detalles-backdrop" onClick={closeDetalles} role="presentation">
            <div id="marco-detalles" onClick={(event) => event.stopPropagation()}>
                <button onClick={closeDetalles} className="exit-btn btn-primary">
                    Cerrar
                </button>
                <h1 className="detalles-title">{selectedProduct?.name}</h1>
                <div className="detalles-lado-a-lado">
                    <div className="contenedor-carrusel-detalles">
                        <DetallesCarousel key={selectedVariant?.id ?? selectedProduct.id} initialProduct={displayedProduct} />
                    </div>
                    <div>
                        {variants.length > 1 && (
                            <div className="detalles-variant-list" aria-label="Variantes disponibles">
                                <h4>Elige una variante</h4>
                                <div className="detalles-variant-options">
                                    {variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            type="button"
                                            className={`detalles-variant-option ${selectedVariant?.id === variant.id ? "is-selected" : ""}`}
                                            aria-pressed={selectedVariant?.id === variant.id}
                                            onClick={() => setVariantSelection({ productId: selectedProduct.id, variantId: variant.id })}
                                        >
                                            {variant.variant_type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="detalles-description">
                            <p>{displayedProduct.description}</p>
                        </div>
                        <div className="detalles-price">
                            <h4>{formatCurrency(displayedProduct.price)}</h4>
                        </div>
                        {checkOutEnabled && (
                            <button className="btn-pop" disabled={displayedProduct.quantity <= 0} onClick={() => addToCart(selectedCartItem)}>
                                {displayedProduct.quantity > 0 ? "Agregar al carrito" : "Agotado"}
                            </button>
                        )}
                        {displayedProduct.materials && displayedProduct.materials.length > 0 && (
                            <div>
                                <h4>Materiales</h4>
                                <div className="material-container">
                                    {displayedProduct.materials.map((material) => (
                                        <div className="material-card" key={material}>
                                            {material}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {selectedVariant && <p className="detalles-variant-stock">{selectedVariant.variant_type} · {selectedVariant.quantity} disponibles</p>}
                        <h4>Reseñas</h4>
                        <Reviews productId={selectedProduct.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}