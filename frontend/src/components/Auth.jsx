import { useState } from 'react'
import './Auth.css'

const API = 'http://localhost:5000/api'

function Auth({ onLogin }) {
  const [loginMode, setLoginMode] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')

  const toggleForm = () => {
    setLoginMode(!loginMode)
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPass('')
    setErr('')
    setMsg('')
  }

  const submitForm = async (e) => {
    e.preventDefault()
    setErr('')
    setMsg('')

    if (!loginMode) {
      if (!name || !email || !password) {
        setErr('Fill all fields')
        return
      }
      if (password !== confirmPass) {
        setErr('Passwords dont match')
        return
      }
      try {
        const res = await fetch(`${API}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        })
        const data = await res.json()
        if (!data.ok) {
          setErr(data.msg)
          return
        }
        setMsg('Account created! Please log in.')
        setLoginMode(true)
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPass('')
      } catch {
        setErr('Cant reach server')
      }
    } else {
      if (!email || !password) {
        setErr('Fill all fields')
        return
      }
      try {
        const res = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (!data.ok) {
          setErr(data.msg)
          return
        }
        onLogin(data.user, data.token)
      } catch {
        setErr('Cant reach server')
      }
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={submitForm}>
        <h2>{loginMode ? 'Login' : 'Sign Up'}</h2>

        {!loginMode && (
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {!loginMode && (
          <div className="form-group">
            <label htmlFor="confirmPass">Confirm Password</label>
            <input
              id="confirmPass"
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
          </div>
        )}

        {err && <p className="error-message">{err}</p>}
        {msg && <p className="success-message">{msg}</p>}

        <button type="submit">{loginMode ? 'Login' : 'Sign Up'}</button>

        <p className="toggle-text">
          {loginMode ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className="toggle-link" onClick={toggleForm}>
            {loginMode ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  )
}

export default Auth
