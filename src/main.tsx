import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import store from './redux/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <UserProvider>
        <Toaster />
        <App />
      </UserProvider>
    </Provider>
  </StrictMode>,
)
