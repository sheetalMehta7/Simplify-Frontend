import Router from './routes/Router'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import FloatingAlert from './components/FloatingAlert'

function App() {
  return (
    <Provider store={store}>
      <div className="w-screen h-screen overflow-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <FloatingAlert />
        <Router />
      </div>
    </Provider>
  )
}

export default App
