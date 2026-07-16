import "./detalles.css"
import DetallesCarousel from "./DetallesCarousel"
import Reviews from "../review/review"

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
                    <h1 class="detalles-title">{initialProduct?.name}</h1>
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
                                {(initialProduct.materials && initialProduct.materials.length > 0) && (
                                    <div>
                                        <h4>Materiales</h4>
                                        <div class="material-container">{initialProduct.materials.map((material) => (
                                            <div class="material-card" key={material}>
                                                {material}
                                            </div>
                                        ))}</div>
                                    </div>
                                )}
                                {
                                    (initialProduct.sizes) && (
                                    <>
                                    <h4>Tamaño</h4>
                                    <div>{initialProduct.size}</div>
                                    </>)

                                }
                                <Reviews />
                            </div>
                        </div>
                </div>
        )
}