import CatalogPage from '../catalog/CatalogPage'
import './Aretes.css'

export default function Aretes({ onAddToCart, title = 'Aretes', subtitle = 'Descubre nuestros aretes más hermosos y elegantes' }) {
  return (
    <CatalogPage
      title={title}
      subtitle={subtitle}
      category="aretes"
      onAddToCart={onAddToCart}
    />
  )
}
