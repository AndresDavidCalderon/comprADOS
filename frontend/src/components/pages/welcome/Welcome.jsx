import "./welcome.css";
import Collares from '../../collares/Collares'
import Manillas from '../../manillas/Manillas'
import Aretes from '../../aretes/Aretes'
import { productCatalog } from '@/data/products'

export default function Welcome({addToCart}) {
    return (
        <>
            <div className="home-video-container">
                <video autoPlay muted loop className="home-video">
                    <source src="/video-intro-web-optimized.mp4" type="video/mp4" />
                </video>
                <header className="home-header">
                    <h1>Bienvenidos a <span>ADOS Me Gusta</span></h1>
                    <p>Inspirados en tí</p>
                </header>
            </div>
            <Collares
                products={productCatalog.collares.products}
                onAddToCart={addToCart}
                title={productCatalog.collares.title}
                subtitle={productCatalog.collares.subtitle}
            />
            <Manillas
                products={productCatalog.manillas.products}
                onAddToCart={addToCart}
                title={productCatalog.manillas.title}
                subtitle={productCatalog.manillas.subtitle}
            />
            <Aretes
                products={productCatalog.aretes.products}
                onAddToCart={addToCart}
                title={productCatalog.aretes.title}
                subtitle={productCatalog.aretes.subtitle}
            />
        </>
    );
}