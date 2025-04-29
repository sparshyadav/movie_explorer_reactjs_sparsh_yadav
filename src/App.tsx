import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Home from './pages/Home/Home';
import AddMovie from './pages/AddMovie/AddMovie';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/create-movie' element={<AddMovie />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
