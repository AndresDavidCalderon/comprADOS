import { useEffect, useState,useContext } from 'react'
import './CatalogPage.css'
import ApiContext from '../../context/ApiContext'
import Detalles from '../detalles-producto/detalles'

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

export default function CatalogPage({ title, subtitle, category, onAddToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [viendoDetalles,setViendoDetalles] = useState(null)
  const { apiUrl } = useContext(ApiContext);

  useEffect(() => {
    if (!category) return

    const loadProducts = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await fetch(`${apiUrl}/productos/categorias/${category}`)
        if (!response.ok) {
          throw new Error("No se pudieron cargar los productos")
        }
        const data = await response.json()
        setProducts(data.filter((product) => !product.oculto))
      } catch (fetchError) {
        setError(fetchError.message)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [category])

  const getProductImage = (product) => product.photos?.[0] || product.image || ""

  return (
    <section className="catalog-page">
      <header className="catalog-header">
        <h1 className="catalog-title">{title}</h1>
        <p className="catalog-subtitle">{subtitle}</p>
      </header>

      {loading && <p className="catalog-state">Cargando productos...</p>}
      {error && <p className="catalog-state catalog-state-error">{error}</p>}

      <div className="catalog-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id} onClick={() => setViendoDetalles(product)}>
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
              className="add-to-cart-btn"
              type="button"
              onClick={() => onAddToCart?.(product)}
            >
              Agregar al carrito
            </button>
          </article>
        ))}
      </div>
      {viendoDetalles && (<Detalles initialProduct={viendoDetalles} onExit={() => setViendoDetalles(null)} />) }
    </section>
  )
}
