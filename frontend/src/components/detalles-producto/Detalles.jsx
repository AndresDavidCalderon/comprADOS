import "./detalles.css"
import DetallesCarousel from "./DetallesCarousel"
import Reviews from "../review/review"
import { useContext } from "react"
import DetallesContext from "../../context/DetallesContext"
import cartContext from "../../context/CartContext"

const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value)

export default function Detalles() {
    const { selectedProduct, closeDetalles } = useContext(DetallesContext)
    const { addToCart } = useContext(cartContext)

    if (!selectedProduct) {
        return null
    }

    return (
        <div className="detalles-backdrop" onClick={closeDetalles} role="presentation">
            <div id="marco-detalles" onClick={(event) => event.stopPropagation()}>
                <button onClick={closeDetalles} className="exit-btn btn-primary">
                    Cerrar
                </button>
                <h1 className="detalles-title">{selectedProduct?.name}</h1>
                <div className="detalles-lado-a-lado">
                    <div className="contenedor-carrusel-detalles">
                        <DetallesCarousel initialProduct={selectedProduct} />
                    </div>
                    <div>
                        <div className="detalles-description">
                            <p>{selectedProduct.description}</p>
                        </div>
                        <div className="detalles-price">
                            <h4>{formatCurrency(selectedProduct.price)}</h4>
                        </div>
                        <button className="btn-pop" onClick={() => addToCart(selectedProduct)}>
                            Agregar al carrito
                        </button>
                        {selectedProduct.materials && selectedProduct.materials.length > 0 && (
                            <div>
                                <h4>Materiales</h4>
                                <div className="material-container">
                                    {selectedProduct.materials.map((material) => (
                                        <div className="material-card" key={material}>
                                            {material}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {selectedProduct.size && (
                            <>
                                <h4>Tamaño</h4>
                                <div>{selectedProduct.size}</div>
                            </>
                        )}
                        <h4>Reseñas</h4>
                        <Reviews productId={selectedProduct.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}