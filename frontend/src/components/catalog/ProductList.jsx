import cartAddIcon from '../../assets/cart-add.svg'

const colorClassMap = {
  Verde: 'dot-green',
  Vino: 'dot-wine',
  Naranja: 'dot-orange',
  Miel: 'dot-honey',
  Perla: 'dot-pearl',
  Dorado: 'dot-gold',
  Negro: 'dot-black',
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)

const getProductImage = (product) => product.photos?.[0] || product.image || ''

export default function ProductList({ products, onProductClick, onAddToCart }) {
  return (
    <div className="catalog-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id} onClick={() => onProductClick(product)}>
          <img className="product-image" src={getProductImage(product)} alt={product.name} />
          <div className="product-meta-row">
            <div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{formatCurrency(product.price)}</p>
            </div>
            {product.color && (
              <div className="product-colors" aria-label={`Color disponible: ${product.color}`}>
                <span className={`color-dot ${colorClassMap[product.color] || 'dot-neutral'}`}></span>
                <span className="color-text">{product.color}</span>
              </div>
            )}
          </div>
          <button
            className="btn-pop add-to-cart-btn"
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onAddToCart(product)
            }}
          >
            Agregar al carrito
            <img src={cartAddIcon} alt="Agregar al carrito" className="add-to-cart-icon" />
          </button>
        </article>
      ))}
    </div>
  )
}