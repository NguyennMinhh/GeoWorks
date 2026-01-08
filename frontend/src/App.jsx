import react from 'react'
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom'
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Home from "./pages/Home"
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import BaseMap from './pages/map/BaseMap'

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/map" element={<BaseMap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
