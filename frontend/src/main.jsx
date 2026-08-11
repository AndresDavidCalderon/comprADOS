import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {AuthProvider} from './context/AuthContext.jsx'
import {ApiProvider} from './context/ApiContext.jsx'
import {DetallesProvider} from './context/DetallesContext.jsx'
import {CartProvider} from './context/CartContext.jsx'
import './colors.css'
import './buttons.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ApiProvider>
        <DetallesProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </DetallesProvider>
      </ApiProvider>
    </AuthProvider>
  </StrictMode>,
)
