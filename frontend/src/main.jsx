import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {AuthProvider} from './context/AuthContext.jsx'
import {ApiProvider} from './context/ApiContext.jsx'
import './colors.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ApiProvider>
        <App />
      </ApiProvider>
    </AuthProvider>
  </StrictMode>,
)
