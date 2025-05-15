
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Configurar viewport meta tag para dispositivos móveis
if (!document.querySelector('meta[name="viewport"]')) {
  const meta = document.createElement('meta')
  meta.name = 'viewport'
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
  document.head.appendChild(meta)
}

createRoot(document.getElementById("root")!).render(<App />);
