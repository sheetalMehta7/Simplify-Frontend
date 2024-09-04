import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ErrorProvider } from './context/ErrorContext'

const rootElement = document.getElementById('root')

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <ErrorProvider>
      <App />
    </ErrorProvider>,
  )
} else {
  console.error('Root element not found')
}
