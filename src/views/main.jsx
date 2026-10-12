// Initiera översättningar innan React-vyerna renderas.
import '../i18n';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from '../context/AuthProvider.jsx';

// AuthProvider gör inloggningsdata tillgänglig i hela appen.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider> 
  </StrictMode>,
)
