import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Home from './pages/Home/Home';
import AddMovie from './pages/AddMovie/AddMovie';
// import MovieDetailsPage from './pages/MovieDetailsPage/MovieDetailsPage';
import MovieDetails from './components/MovieDetails/MovieDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/create-movie' element={<AddMovie />} />
        <Route path='/' element={<Home />} />
        <Route path='/movie-details/:id' element={<MovieDetails />} />
      </Routes>
    </Router>
  )
}

export default App
