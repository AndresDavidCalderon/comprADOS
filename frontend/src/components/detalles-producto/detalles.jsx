import "./detalles.css"
import DetallesCarousel from "./DetallesCarousel"

export default function Detalles({ initialProduct,onExit }) {
        return (
                <div id="marco-detalles">
                    <button onClick={onExit} className="exit-btn">
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
                                    <p>{initialProduct.price}</p>
                                </div>
                            </div>
                        </div>
                </div>
        )
}