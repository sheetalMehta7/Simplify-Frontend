// src/App.tsx
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/store'
import FloatingAlert from './components/FloatingAlert'
import Router from './routes/Router'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="w-screen h-screen overflow-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <FloatingAlert />
          <Router />
        </div>
      </PersistGate>
    </Provider>
  )
}

export default App
