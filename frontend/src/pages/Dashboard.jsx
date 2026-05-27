import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Dashboard.scss'

export default function Dashboard() {
  const [joinCode, setJoinCode] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase()
    navigate(`/room/${code}`)
  }

  const joinRoom = () => {
    if (joinCode.trim()) navigate(`/room/${joinCode.toUpperCase()}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme')
    document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="dashboard__nav">
        <div className="dashboard__logo">
          <span className="logo-icon">✏️</span>
          <h2>CollabNotes</h2>
        </div>

        <div className="dashboard__nav-right">
          <span className="dashboard__greeting">Hey, {user?.username}! 👋</span>
          <button className="dashboard__nav-btn dashboard__nav-btn--notes"
            onClick={() => navigate('/history')}>
            📝 My Notes
          </button>
          <button className="dashboard__nav-btn dashboard__nav-btn--logout"
            onClick={handleLogout}>
            Logout
          </button>
          <button className="dashboard__nav-btn dashboard__nav-btn--theme"
            onClick={toggleTheme}>
            🌙
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="dashboard__hero">
        <h1>Start Collaborating ✨</h1>
        <p>Create a room or join an existing one to start editing together</p>
      </div>

      {/* Cards */}
      <div className="dashboard__grid">
        <div className="dashboard__card">
          <span className="card-icon">🚀</span>
          <h3>Create Room</h3>
          <p>Start a new collaborative note session and invite others with a room code</p>
          <button className="dashboard__create-btn" onClick={createRoom}>
            Create New Room
          </button>
        </div>

        <div className="dashboard__card">
          <span className="card-icon">🔗</span>
          <h3>Join Room</h3>
          <p>Enter a room code to join an existing collaborative session</p>
          <input
            className="dashboard__join-input"
            placeholder="Enter code (e.g. AB12)"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && joinRoom()}
            maxLength={4}
          />
          <button className="dashboard__join-btn" onClick={joinRoom}>
            Join Room
          </button>
        </div>
      </div>
    </div>
  )
}