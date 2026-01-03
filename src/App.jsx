import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from './stores/authStore'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import WorkoutTracker from './pages/WorkoutTracker'
import ActiveSession from './pages/ActiveSession'
import EmailConfirmed from './pages/EmailConfirmed'

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user } = useAuthStore()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  const { initialize } = useAuthStore()
  const [initializing, setInitializing] = useState(true)

  // Initialize auth state on app load and wait for it to complete
  useEffect(() => {
    const initAuth = async () => {
      await initialize()
      setInitializing(false)
    }
    initAuth()
  }, [initialize])

  // Show loading screen while checking auth
  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter basename="/RepRush">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-confirmed" element={<EmailConfirmed />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/workout" 
          element={
            <ProtectedRoute>
              <WorkoutTracker />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/workout/session" 
          element={
            <ProtectedRoute>
              <ActiveSession />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
