import CatalogPage from '../catalog/CatalogPage'
import './Manillas.css'

export default function Manillas({ onAddToCart, title = 'Manillas', subtitle = 'Encuentra tu manilla perfecta en nuestra colección' }) {
  return (
    <CatalogPage
      title={title}
      subtitle={subtitle}
      category="manillas"
      onAddToCart={onAddToCart}
    />
  )
}
