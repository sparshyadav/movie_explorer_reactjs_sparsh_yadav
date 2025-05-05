import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Home from './pages/Home/Home';
import AddMovie from './pages/AddMovie/AddMovie';
import MovieDetails from './components/MovieDetails/MovieDetails';
import AllMoviesPage from './pages/AllMoviesPage/AllMoviesPage';
import SearchResultPage from './components/SearchResultPage/SearchResultPage';
import SubscriptionPage from './pages/SubscriptionPage/SubscriptionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/create-movie' element={<AddMovie />} />
        <Route path='/' element={<Home />} />
        <Route path='/movie-details/:id' element={<MovieDetails />} />
        <Route path='/all-movies' element={<AllMoviesPage />} />
        <Route path='/search' element={<SearchResultPage />} />
        <Route path='/subscribe' element={<SubscriptionPage />} />
      </Routes>
    </Router>
  )
}

export default App
