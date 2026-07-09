import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {AuthProvider} from './context/AuthContext.jsx'
import {ApiProvider} from './context/ApiContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApiProvider>
      <App />
    </ApiProvider>
  </StrictMode>,
)
