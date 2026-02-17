import './App.css'
import Navbar from './components/layouts/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

function App() {

  return (
    <>
      <Navbar user={{ name: "John Doe", role: "user" }} />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

    </>

  )
}

export default App
