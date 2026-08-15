import {createContext, useContext,useState} from 'react';
import AuthContext from './AuthContext.jsx';

const cartContext = createContext({
    apiUrl: 'http://localhost:8000'
});

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([])
    const addToCart = (product) => {
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
    return <cartContext.Provider value={{ cartItems, addToCart, incrementQuantity, decrementQuantity }}>{children}</cartContext.Provider>;
}

export default cartContext;