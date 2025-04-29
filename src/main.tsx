import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MovieCard from './components/MovieCard/MovieCard.tsx'
import MovieContext from './context/MoviesContext.tsx'
import { UserProvider } from './context/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>

      <App />
  </StrictMode>,
)
