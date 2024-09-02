import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorProvider } from './context/ErrorContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorProvider>
    <App />
  </ErrorProvider>
);
