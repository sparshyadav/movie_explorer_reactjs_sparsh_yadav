import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home/Home';
import { MovieProvider } from './context/MoviesContext';

function App() {
  return (
    <MovieProvider>
      <UserProvider>
        <Router>
          <Toaster />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<Home />} />
          </Routes>
        </Router>
      </UserProvider>
    </MovieProvider>
  )
}

export default App
