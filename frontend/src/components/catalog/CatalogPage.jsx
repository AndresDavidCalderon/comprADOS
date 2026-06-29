import './CatalogPage.css'

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

export default function CatalogPage({ title, subtitle, products, onAddToCart }) {
  return (
    <section className="catalog-page">
      <header className="catalog-header">
        <h1 className="catalog-title">{title}</h1>
        <p className="catalog-subtitle">{subtitle}</p>
      </header>

      <div className="catalog-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <img className="product-image" src={product.image} alt={product.name} />
            <div className="product-meta-row">
              <div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{formatCurrency(product.price)}</p>
              </div>
              <div className="product-colors" aria-label={`Color disponible: ${product.color}`}>
                <span className={`color-dot ${colorClassMap[product.color] || 'dot-neutral'}`}></span>
                <span className="color-text">{product.color}</span>
              </div>
            </div>
            <button
              className="add-to-cart-btn"
              type="button"
              onClick={() => onAddToCart(product)}
            >
              Agregar al carrito
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
