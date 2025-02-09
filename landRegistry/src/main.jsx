import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { LandProvider } from '../context/LandRegistry'
import { Toaster } from 'react-hot-toast';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LandProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LandProvider>
    <Toaster />
  </StrictMode>,
)
