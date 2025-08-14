import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RelayEnvironmentProvider } from 'react-relay'
import './index.css'
import App from './App.tsx'
import environment from './relay/environment'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RelayEnvironmentProvider environment={environment}>
      <App />
    </RelayEnvironmentProvider>
  </StrictMode>,
)
