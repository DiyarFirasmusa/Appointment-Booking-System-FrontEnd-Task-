import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = import.meta.env.DEV ? '/dev-sw.js?dev-sw' : '/sw.js'

    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        console.log('✅ SW registered: ', registration)
      })
      .catch(registrationError => {
        console.log('❌ SW registration failed: ', registrationError)
      })
  })
}

createRoot(document.getElementById('root')!).render(<App />)
