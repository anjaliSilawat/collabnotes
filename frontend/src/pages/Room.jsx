// Room.jsx

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import '../styles/Room.scss'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function Room() {
  const { roomCode } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [note, setNote] = useState('')
  const [title, setTitle] = useState('Untitled Note')
  const [users, setUsers] = useState(1)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const socketRef = useRef(null)

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

  useEffect(() => {
    const loadNote = async () => {
      try {
        const res = await axios.get(
          `${BACKEND}/api/notes/${roomCode}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (res.data) {
          setNote(res.data.content || '')
          setTitle(res.data.title || 'Untitled Note')
        }

      } catch (err) {
        console.log('No existing note')
      }
    }

    loadNote()

    socketRef.current = io(BACKEND)

    socketRef.current.emit('join-room', roomCode)

    socketRef.current.on('note-change', (content) => {
      setNote(content)
    })

    socketRef.current.on('user-joined', () => {
      setUsers(prev => prev + 1)
    })

    return () => socketRef.current.disconnect()

  }, [roomCode])

  const handleChange = (e) => {
    const content = e.target.value

    setNote(content)

    socketRef.current.emit(
      'note-change',
      { roomCode, content }
    )
  }

  const saveNote = async () => {
    setSaving(true)

    try {
      await axios.post(
        `${BACKEND}/api/notes/save`,
        {
          roomCode,
          content: note,
          title
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setSaved(true)

      setTimeout(() => setSaved(false), 2000)

    } catch (err) {
      alert('Save failed — try again')
    }

    setSaving(false)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode)

    setCopied(true)

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="room">
      <nav className="room__nav">

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >

          <div className="room__logo">
            <span>CollabNotes ✏️</span>
          </div>

          <div className="room__room-badge">
            <span className="room-label">Room:</span>

            <span className="room-code">
              {roomCode}
            </span>

            <button
              className="copy-btn"
              onClick={copyCode}
            >
              {copied ? '✅' : '📋'}
            </button>
          </div>
        </div>

        <input
          className="room__title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title..."
        />

        <div className="room__nav-right">

          <div className="room__users-badge">
            <span className="pulse-dot"></span>
            <span>{users} editing</span>
          </div>

          <button
            className="room__save-btn"
            onClick={saveNote}
            disabled={saving}
          >
            {saving
              ? '⏳ Saving...'
              : saved
              ? '✅ Saved!'
              : '💾 Save'}
          </button>

          <button
            className="room__leave-btn"
            onClick={() => navigate('/dashboard')}
          >
            Leave
          </button>

          <button
            className="room__theme-btn"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <div className="room__editor">
        <textarea
          className="room__textarea"
          value={note}
          onChange={handleChange}
          placeholder={`Start typing...\n\nShare code "${roomCode}" to collaborate! 🚀`}
        />
      </div>
    </div>
  )
}