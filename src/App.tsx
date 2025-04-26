import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import { Toaster } from 'react-hot-toast';
<<<<<<< HEAD
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Toaster/> 
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Navbar />} />
      </Routes>
    </Router>
=======
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
>>>>>>> main
  )
}

export default App
