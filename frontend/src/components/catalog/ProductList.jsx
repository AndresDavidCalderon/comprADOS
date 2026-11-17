import { useContext } from 'react'
import cartAddIcon from '../../assets/cart-add.svg'
import cartContext from '../../context/CartContext'
import DetallesContext from '../../context/DetallesContext'

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)

const getShowcaseVariant = (product) => {
  const variants = product.variants || []
  if (Number.isInteger(product.showcase_variant)) {
    return variants[product.showcase_variant] ?? variants.find((variant) => variant.is_showcase) ?? variants[0]
  }
  return variants.find((variant) => variant.is_showcase) || variants[0]
}

export default function ProductList({ products }) {
  const { addToCart, checkOutEnabled } = useContext(cartContext)
  const { openDetalles } = useContext(DetallesContext)

  return (
    <div className="catalog-grid">
      {products.map((product) => {
        const showcaseVariant = getShowcaseVariant(product)
        const image = showcaseVariant?.photos?.[0] || product.photos?.[0] || product.image || ''
        const price = showcaseVariant?.price ?? product.price
        const cartItem = showcaseVariant
          ? { ...product, ...showcaseVariant, id: showcaseVariant.id, product_id: product.id, variant_id: showcaseVariant.id, name: product.name }
          : product

        return (
          <article className="product-card" key={product.id} onClick={() => openDetalles(product)}>
            <img className="product-image" src={image} alt={product.name} />
            <div className="product-meta-row">
              <div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{formatCurrency(price)}</p>
              </div>
            </div>
            {checkOutEnabled && (
              <button
                className="btn-pop add-to-cart-btn"
                type="button"
                disabled={showcaseVariant ? showcaseVariant.quantity <= 0 : product.quantity <= 0}
                onClick={(event) => {
                  event.stopPropagation()
                  addToCart(cartItem)
                }}
              >
                Agregar al carrito
                <img src={cartAddIcon} alt="Agregar al carrito" className="add-to-cart-icon" />
              </button>
            )}
          </article>
        )
      })}
    </div>
  )
}