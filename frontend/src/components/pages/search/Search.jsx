import ProductList from "@/components/catalog/ProductList"
import { useEffect, useState, useContext } from "react"
import ApiContext from "@/context/ApiContext"
import cartContext from "@/context/CartContext"
import DetallesContext from "@/context/DetallesContext"

export default function Search({term}) {
    const [products, setProducts] = useState([])

    const { apiUrl } = useContext(ApiContext)

    useEffect(() => {
        fetch(`${apiUrl}/productos/search?query=${encodeURIComponent(term)}`)
            .then(response => response.json())
            .then(data => setProducts(data))
    }, [apiUrl, term])

    return (
    <div>
        <h1>Resultados para "{term}"</h1>
        <ProductList
            products={products}
            onProductClick={(product) => {
                const { openDetalles } = useContext(DetallesContext)
                openDetalles(product)
            }
            }
            onAddToCart={(product) => {
                const { addToCart } = useContext(cartContext)
                addToCart(product)
            }}
        />
    </div>
    )
}