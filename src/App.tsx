import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar/Navbar';
import { UserProvider } from './context/UserContext';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <UserProvider>
      <Router>
        <Toaster />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/' element={<Navbar />} />
          <Route path='/footer' element={<Footer />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
