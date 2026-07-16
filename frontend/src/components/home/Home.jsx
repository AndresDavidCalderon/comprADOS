import Aretes from '../aretes/Aretes'
import Collares from '../collares/Collares'
import Manillas from '../manillas/Manillas'
import './home.css'

export default function Home({ onAddToCart}) {
    return (
        <section className="home">
            <div className="home-hero">
                <h1>Bienvenido a ADOS Me Gusta</h1>
                <p>Descubre nuestras colecciones exclusivas de joyería fina</p>
            </div>
            <div className="home-catalogs">
                <Collares
                    onAddToCart={onAddToCart}
                    title="Collares"
                    subtitle="Explora nuestra selección de collares exclusivos"
                />
                <Manillas
                    onAddToCart={onAddToCart}
                    title="Manillas"
                    subtitle="Encuentra la manilla ideal para tu estilo"
                />
                <Aretes
                    onAddToCart={onAddToCart}
                    title="Aretes"
                    subtitle="Descubre aretes elegantes para cada ocasión"
                />
            </div>
        </section>
    )
}