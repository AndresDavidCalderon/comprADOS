import { createContext, useState } from 'react'

const DetallesContext = createContext({
  selectedProduct: null,
  openDetalles: () => {},
  closeDetalles: () => {},
})

export function DetallesProvider({ children }) {
  const [selectedProduct, setSelectedProduct] = useState(null)

  const openDetalles = (product) => {
    setSelectedProduct(product)
  }

  const closeDetalles = () => {
    setSelectedProduct(null)
  }

  return (
    <DetallesContext.Provider value={{ selectedProduct, openDetalles, closeDetalles }}>
      {children}
    </DetallesContext.Provider>
  )
}

export default DetallesContext