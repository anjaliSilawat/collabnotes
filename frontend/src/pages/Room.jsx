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
  const [uploading, setUploading] = useState(false)

  const socketRef = useRef(null)

  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'light'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // ---------------- SOCKET + LOAD NOTE ----------------
  useEffect(() => {

    const loadNote = async () => {
      try {
        const res = await axios.get(
          `${BACKEND}/api/notes/${roomCode}`,
          {
            headers: { Authorization: `Bearer ${token}` }
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

  // ---------------- TEXT CHANGE ----------------
  const handleChange = (e) => {
    const content = e.target.value
    setNote(content)

    socketRef.current.emit('note-change', {
      roomCode,
      content
    })
  }

  // ---------------- SAVE NOTE ----------------
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
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)

    } catch (err) {
      alert('Save failed — try again')
    }

    setSaving(false)
  }

  // ---------------- COPY ROOM CODE ----------------
  const copyCode = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ---------------- FILE UPLOAD ----------------
  const handleFileUpload = async (e) => {

    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    try {

      const formData = new FormData()
      formData.append('file', file)

      const res = await axios.post(
        `${BACKEND}/api/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const fileUrl = res.data.url
      const fileName = res.data.originalName

      // 👉 SIMPLE SAFE FORMAT (NO UI BREAK)
      const contentToAdd = `\n📎 ${fileName}\n${fileUrl}\n`

      const updatedNote = note + contentToAdd

      setNote(updatedNote)

      socketRef.current.emit('note-change', {
        roomCode,
        content: updatedNote
      })

    } catch (err) {
      console.log(err)
      alert('Upload failed')
    }

    setUploading(false)
  }

  // ---------------- UI ----------------
  return (

    <div className="room">

      <nav className="room__nav">

        <div style={{ display: 'flex', gap: '1rem' }}>

          <div className="room__logo">
            <span>CollabNotes ✏️</span>
          </div>

          <div className="room__room-badge">
            <span>Room: {roomCode}</span>

            <button onClick={copyCode}>
              {copied ? '✅' : '📋'}
            </button>
          </div>

        </div>

        <input
          className="room__title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <div className="room__nav-right">

          <span>{users} editing</span>

          <label>
            📎
            <input
              type="file"
              hidden
              onChange={handleFileUpload}
            />
          </label>

          <button onClick={saveNote}>
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </button>

          <button onClick={() => navigate('/dashboard')}>
            Leave
          </button>

        </div>

      </nav>

      {/* ---------------- EDITOR (RESTORED ORIGINAL UI) ---------------- */}
      <div className="room__editor">

        {uploading && (
          <p style={{ padding: '10px' }}>
            Uploading...
          </p>
        )}

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