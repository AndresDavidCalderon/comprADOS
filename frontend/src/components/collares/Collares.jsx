import CatalogPage from '../catalog/CatalogPage'
import './Collares.css'

export default function Collares({ onAddToCart, title = 'Collares', subtitle = 'Descubre nuestra colección de collares exclusivos' }) {
  return (
    <CatalogPage
      title={title}
      subtitle={subtitle}
      category="collares"
      onAddToCart={onAddToCart}
    />
  )
}
