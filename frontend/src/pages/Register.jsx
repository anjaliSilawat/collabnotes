import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8000/api/auth/register', form)
      setSuccess('Registered! Redirecting...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', 
      alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <div style={{ background: 'white', padding: '2rem', 
        borderRadius: '12px', width: '360px', 
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          Create Account
        </h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', 
              marginBottom: '1rem', borderRadius: '8px', 
              border: '1px solid #ddd', fontSize: '14px' }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', 
              marginBottom: '1rem', borderRadius: '8px', 
              border: '1px solid #ddd', fontSize: '14px' }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', 
              marginBottom: '1rem', borderRadius: '8px', 
              border: '1px solid #ddd', fontSize: '14px' }}
            required
          />
          <button type="submit"
            style={{ width: '100%', padding: '0.75rem', 
              background: '#185FA5', color: 'white', 
              border: 'none', borderRadius: '8px', 
              fontSize: '14px', cursor: 'pointer' }}>
            Register
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '14px' }}>
          Have account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}