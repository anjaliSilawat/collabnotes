// Register.jsx

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Register.scss'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
      await axios.post(
        `${BACKEND}/api/auth/register`,
        form
      )

      setSuccess('Account created! Redirecting...')

      setTimeout(() => navigate('/login'), 1500)

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed'
      )
    }
  }

  return (
    <div className="register-page">

      <button
        className="login-page__theme-toggle"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="register-page__card">
        <div className="register-page__logo">
          <span className="logo-icon">✏️</span>

          <h1>Create Account</h1>

          <p>Join CollabNotes today</p>
        </div>

        {error && (
          <div className="register-page__error">
            {error}
          </div>
        )}

        {success && (
          <div className="register-page__success">
            {success}
          </div>
        )}

        <form
          className="register-page__form"
          onSubmit={handleSubmit}
        >

          <div className="register-page__input-group">
            <label>Username</label>

            <input
              placeholder="yourname"
              value={form.username}
              onChange={e =>
                setForm({
                  ...form,
                  username: e.target.value
                })
              }
              required
            />
          </div>

          <div className="register-page__input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
              required
            />
          </div>

          <div className="register-page__input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="register-page__btn"
          >
            Create Account →
          </button>
        </form>

        <div className="register-page__footer">
          Have account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}