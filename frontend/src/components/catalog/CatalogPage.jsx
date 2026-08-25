import { useEffect, useState, useContext } from 'react'
import './CatalogPage.css'
import ApiContext from '../../context/ApiContext'
import ProductList from './ProductList'

export default function CatalogPage({ title, subtitle, category}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { apiUrl } = useContext(ApiContext)

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

  return (
    <section className="catalog-page">
      <header className="catalog-header">
        <h1 className="catalog-title">{title}</h1>
        {subtitle && <p className="catalog-subtitle">{subtitle}</p>}
      </header>

      {loading && <p className="catalog-state">Cargando productos...</p>}
      {error && <p className="catalog-state catalog-state-error">{error}</p>}

      <ProductList products={products} />
    </section>
  )
}
