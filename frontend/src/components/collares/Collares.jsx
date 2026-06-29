import CatalogPage from '../catalog/CatalogPage'
import './Collares.css'

export default function Collares({ products, onAddToCart, title, subtitle }) {
  return (
    <CatalogPage
      title={title}
      subtitle={subtitle}
      products={products}
      onAddToCart={onAddToCart}
    />
  )
}
