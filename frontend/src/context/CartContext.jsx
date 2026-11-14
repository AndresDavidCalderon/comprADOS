import { createContext, useState } from 'react'

const cartContext = createContext({
    apiUrl: 'http://localhost:8000',
    checkOutEnabled: false,
})

export function CartProvider({ children, checkOutEnabled = false }) {
    const [cartItems, setCartItems] = useState([])
    const addToCart = (product) => {
    if (!checkOutEnabled) return

    setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id)

        if (existingItem) {
        return prevItems.map((item) =>
            item.id === product.id
            ? {
                ...item,
                quantityOnCart: item.quantityOnCart + 1,
                }
            : item,
        )
        }

        return [...prevItems, { ...product, quantityOnCart: 1 }]
    })
    }

    const incrementQuantity = (id) => {
        console.log('Decrementing quantity for item with id:', id);
        const item = cartItems.find(item => item.id === id);
        if (item.quantityOnCart < item.quantity) {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
            item.id === id
                ? {
                    ...item,
                    quantityOnCart: item.quantityOnCart + 1,
                }
                : item,
        ))
        }
        
    }

    const decrementQuantity = (id) => {
        console.log('Decrementing quantity for item with id:', id);
        setCartItems((prevItems) =>
        prevItems
            .map((item) =>
            item.id === id
                ? {
                    ...item,
                    quantityOnCart: Math.max(0, item.quantityOnCart - 1),
                }
                : item,
            )
            .filter((item) => item.quantityOnCart > 0),
        )
    }
    return <cartContext.Provider value={{ cartItems, addToCart, incrementQuantity, decrementQuantity, checkOutEnabled }}>{children}</cartContext.Provider>
}

export default cartContext;