import CatalogPage from '../catalog/CatalogPage'
import './Aretes.css'

export default function Aretes({ products, onAddToCart, title, subtitle }) {
  return (
    <CatalogPage
      title={title}
      subtitle={subtitle}
      products={products}
      onAddToCart={onAddToCart}
    />
  )
}
