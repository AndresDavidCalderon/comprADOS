import CatalogPage from '../catalog/CatalogPage'
import './Manillas.css'

export default function Manillas({ products, onAddToCart, title, subtitle }) {
  return (
    <CatalogPage
      title={title}
      subtitle={subtitle}
      products={products}
      onAddToCart={onAddToCart}
    />
  )
}
