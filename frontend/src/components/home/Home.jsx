import CatalogPage from '../catalog/CatalogPage'
import { productCatalog } from '../../data/products'
import './home.css'

export default function Home({ onAddToCart}) {
    return (
        <section className="home">
            <div className="home-hero">
                <h1>Bienvenido a ADOS Me Gusta</h1>
                <p>Descubre nuestras colecciones exclusivas de joyería fina</p>
            </div>
            <div className="home-catalogs">
                <CatalogPage
                    category="collares"
                    title={productCatalog.collares.title}
                    onAddToCart={onAddToCart}
                />
                <CatalogPage
                    category="manillas"
                    title={productCatalog.manillas.title}
                    onAddToCart={onAddToCart}
                />
                <CatalogPage
                    category="aretes"
                    title={productCatalog.aretes.title}
                    onAddToCart={onAddToCart}
                />
            </div>
        </section>
    )
}