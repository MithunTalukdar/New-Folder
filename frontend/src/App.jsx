import { useState } from 'react'
import Auth from './components/Auth'
import EmployeeDashboard from './components/EmployeeDashboard'

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  const handleLogin = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
  }

  if (user && token) {
    return <EmployeeDashboard user={user} token={token} onLogout={handleLogout} />
  }

  return <Auth onLogin={handleLogin} />
}

export default App
