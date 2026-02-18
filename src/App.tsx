import './App.css'
import Navbar from './components/layouts/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import PetDetails from './pages/PetDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
    <AuthProvider>
      <ToastProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets/:id" element={<PetDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App

