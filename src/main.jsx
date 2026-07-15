import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { EstimationProvider } from './context/EstimationContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EstimationProvider>
      <App />
    </EstimationProvider>
  </React.StrictMode>,
)
