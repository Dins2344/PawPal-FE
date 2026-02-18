import './App.css'
import Navbar from './components/layouts/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import PetDetails from './pages/PetDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import AdminRoute from './components/admin/AdminRoute'
import ProtectedRoute from './components/layouts/ProtectedRoute'
import Footer from './components/layouts/Footer'

function App() {

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="grow flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pets/:id" element={<PetDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App


