import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ErrorProvider } from './context/ErrorContext'
import { Auth0Provider } from '@auth0/auth0-react'

const rootElement = document.getElementById('root')

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <ErrorProvider>
        <App />
      </ErrorProvider>
    </Auth0Provider>,
  )
} else {
  console.error('Root element not found')
}
