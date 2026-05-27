// History.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import '../styles/History.scss'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function History() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'light'
  )

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    document.documentElement.setAttribute(
      'data-theme',
      newTheme
    )

    setTheme(newTheme)
  }

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme
    )
  }, [theme])

  useEffect(() => {

    const fetchNotes = async () => {
      try {

        const res = await axios.get(
          `${BACKEND}/api/notes/my-notes`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setNotes(res.data)

      } catch (err) {
        console.log('Error fetching notes')
      }

      setLoading(false)
    }

    fetchNotes()

  }, [])

  // DELETE NOTE
  const deleteNote = async (id) => {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this note?'
    )

    if (!confirmDelete) return

    try {

      await axios.delete(
        `${BACKEND}/api/notes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setNotes(prev =>
        prev.filter(note => note._id !== id)
      )

    } catch (err) {
      alert('Failed to delete note')
    }
  }

  return (
    <div className="history">

      <nav className="history__nav">

        <div className="history__logo">
          <span className="logo-icon">✏️</span>
          <h2>CollabNotes</h2>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem'
          }}
        >

          <button
            className="history__back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Dashboard
          </button>

          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <div className="history__content">

        <div className="history__header">
          <h3>My Saved Notes 📝</h3>

          <p>
            {notes.length} note
            {notes.length !== 1 ? 's' : ''}
            {' '}saved
          </p>
        </div>

        {loading && (
          <div className="history__loading">
            <div className="spinner"></div>
            Loading your notes...
          </div>
        )}

        {!loading && notes.length === 0 && (
          <div className="history__empty">

            <span className="empty-icon">
              📭
            </span>

            <h4>No saved notes yet</h4>

            <p>
              Create a room and save your first note!
            </p>

            <button
              onClick={() => navigate('/dashboard')}
            >
              Create Room
            </button>
          </div>
        )}

        <div className="history__list">

          {notes.map(note => (

            <div
              key={note._id}
              className="history__note-card"
              onClick={() =>
                navigate(`/room/${note.roomCode}`)
              }
            >

              <div className="history__note-info">

                <div className="history__note-title">
                  {note.title || 'Untitled Note'}
                </div>

                <div className="history__note-meta">

                  <span className="room-badge">
                    #{note.roomCode}
                  </span>

                  {new Date(
                    note.updatedAt
                  ).toLocaleDateString(
                    'en-IN',
                    {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }
                  )}
                </div>

                <div className="history__note-preview">
                  {note.content || 'Empty note...'}
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNote(note._id)
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '20px'
                  }}
                >
                  🗑️
                </button>

                <div className="note-arrow">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}