import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Home from './pages/Home/Home';
import AddMovie from './pages/AddMovie/AddMovie';
import MovieDetails from './components/MovieDetails/MovieDetails';
import AllMoviesPage from './pages/AllMoviesPage/AllMoviesPage';
import SearchResultPage from './components/SearchResultPage/SearchResultPage';
import SubscriptionPage from './pages/SubscriptionPage/SubscriptionPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RLMBhI8TMsg84IIxvXPopZCBmDkUO20fAdCirw2DNvUt1jQAMOthJd2EjPjbg3qD62Zp8vnZYsr2j2dFx9SndGc009ItOLYgQ');

function App() {
  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/create-movie' element={<AddMovie />} />
          <Route path='/' element={<Home />} />
          <Route path='/movie-details/:id' element={<MovieDetails />} />
          <Route path='/edit-movie/:id' element={<AddMovie />} />
          <Route path='/all-movies' element={<AllMoviesPage />} />
          <Route path='/search' element={<SearchResultPage />} />
          <Route path='/subscribe' element={<SubscriptionPage />} />
          {/* <Route path='/payment' element={<Payment />} /> */}
        </Routes>
      </Elements>
    </Router>
  )
}

export default App

