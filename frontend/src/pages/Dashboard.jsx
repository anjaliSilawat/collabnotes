import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const [joinCode, setJoinCode] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase()
    navigate(`/room/${code}`)
  }

  const joinRoom = () => {
    if (joinCode.trim()) {
      navigate(`/room/${joinCode.toUpperCase()}`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Navbar */}
      <div style={{ background: 'white', padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#185FA5' }}>CollabNotes ✏️</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>
            Hey, {user?.username}!
          </span>
          <button onClick={() => navigate('/history')}
            style={{ padding: '0.5rem 1rem', background: '#1D9E75',
              color: 'white', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontSize: '13px' }}>
            My Notes 📝
          </button>
          <button onClick={handleLogout}
            style={{ padding: '0.5rem 1rem', background: '#ff4d4f',
              color: 'white', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
          justifyContent: 'center' }}>

          {/* Create Room */}
          <div style={{ background: 'white', padding: '2rem',
            borderRadius: '12px', width: '280px', textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Create Room</h3>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '1.5rem' }}>
              Start a new collaborative note session
            </p>
            <button onClick={createRoom}
              style={{ width: '100%', padding: '0.75rem',
                background: '#185FA5', color: 'white',
                border: 'none', borderRadius: '8px',
                fontSize: '14px', cursor: 'pointer' }}>
              Create New Room
            </button>
          </div>

          {/* Join Room */}
          <div style={{ background: 'white', padding: '2rem',
            borderRadius: '12px', width: '280px', textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Join Room</h3>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '1rem' }}>
              Enter a room code to collaborate
            </p>
            <input
              placeholder="Enter room code (e.g. AB12)"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
              style={{ width: '100%', padding: '0.75rem',
                marginBottom: '1rem', borderRadius: '8px',
                border: '1px solid #ddd', fontSize: '14px',
                textAlign: 'center', letterSpacing: '2px' }}
            />
            <button onClick={joinRoom}
              style={{ width: '100%', padding: '0.75rem',
                background: '#1D9E75', color: 'white',
                border: 'none', borderRadius: '8px',
                fontSize: '14px', cursor: 'pointer' }}>
              Join Room
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}