import "./detalles.css"
import DetallesCarousel from "./DetallesCarousel"

const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value)

export default function Detalles({ initialProduct,onExit }) {
        return (
                <div id="marco-detalles">
                    <button onClick={onExit} className="exit-btn btn-primary">
                        Cerrar
                    </button>
                    <h1>{initialProduct?.name}</h1>
                    <div className="detalles-lado-a-lado">
                        <div class="contenedor-carrusel-detalles">

                                    <DetallesCarousel initialProduct={initialProduct} />
                            </div>
                            <div>
                                <div className="detalles-description">
                                    <p>{initialProduct.description}</p>
                                </div>
                                <div className="detalles-price">
                                    <h4>{formatCurrency(initialProduct.price)}</h4>
                                </div>
                            </div>
                        </div>
                </div>
        )
}