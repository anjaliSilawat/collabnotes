import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function History() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/notes/my-notes', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setNotes(res.data)
      } catch (err) {
        console.log('Error fetching notes')
      }
      setLoading(false)
    }
    fetchNotes()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Navbar */}
      <div style={{ background: 'white', padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#185FA5' }}>CollabNotes ✏️</h2>
        <button onClick={() => navigate('/dashboard')}
          style={{ padding: '0.5rem 1rem', background: '#185FA5',
            color: 'white', border: 'none', borderRadius: '8px',
            cursor: 'pointer', fontSize: '13px' }}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
          My Saved Notes 📝
        </h3>

        {loading && (
          <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
        )}

        {!loading && notes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem',
            background: 'white', borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ color: '#888' }}>No saved notes yet — create a room and save!</p>
            <button onClick={() => navigate('/dashboard')}
              style={{ marginTop: '1rem', padding: '0.75rem 1.5rem',
                background: '#185FA5', color: 'white', border: 'none',
                borderRadius: '8px', cursor: 'pointer' }}>
              Create Room
            </button>
          </div>
        )}

        {notes.map(note => (
          <div key={note._id}
            style={{ background: 'white', borderRadius: '12px',
              padding: '1.25rem 1.5rem', marginBottom: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate(`/room/${note.roomCode}`)}>
            <div>
              <div style={{ fontWeight: '600', color: '#1a1a1a',
                marginBottom: '4px', fontSize: '15px' }}>
                {note.title || 'Untitled Note'}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                Room: {note.roomCode} · {new Date(note.updatedAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </div>
              <div style={{ fontSize: '13px', color: '#666',
                marginTop: '6px', lineHeight: '1.4',
                overflow: 'hidden', whiteSpace: 'nowrap',
                textOverflow: 'ellipsis', maxWidth: '500px' }}>
                {note.content || 'Empty note...'}
              </div>
            </div>
            <div style={{ fontSize: '20px', color: '#185FA5' }}>→</div>
          </div>
        ))}
      </div>
    </div>
  )
}