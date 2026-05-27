// Login.jsx

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Login.scss'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'light'
  )

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', newTheme)
    setTheme(newTheme)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(
        `${BACKEND}/api/auth/login`,
        { email, password }
      )

      login(res.data.user, res.data.token)
      navigate('/dashboard')

    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="login-page">

      <button
        className="login-page__theme-toggle"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="login-page__card">
        <div className="login-page__logo">
          <span className="logo-icon">✏️</span>
          <h1>CollabNotes</h1>
          <p>Real-time collaborative notes</p>
        </div>

        {error && (
          <div className="login-page__error">
            {error}
          </div>
        )}

        <form
          className="login-page__form"
          onSubmit={handleSubmit}
        >

          <div className="login-page__input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-page__input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-page__btn"
          >
            Sign In →
          </button>
        </form>

        <div className="login-page__footer">
          No account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  )
}