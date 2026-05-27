import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Room() {
  const { roomCode } = useParams()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [note, setNote] = useState('')
  const [title, setTitle] = useState('Untitled Note')
  const [users, setUsers] = useState(1)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    // Load existing note if saved before
    const loadNote = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/notes/${roomCode}`,
          { headers: { Authorization: `Bearer ${token}` } }
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

    // Connect socket
    socketRef.current = io('http://localhost:8000')
    socketRef.current.emit('join-room', roomCode)

    socketRef.current.on('note-change', (content) => {
      setNote(content)
    })

    socketRef.current.on('user-joined', () => {
      setUsers(prev => prev + 1)
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [roomCode])

  const handleChange = (e) => {
    const content = e.target.value
    setNote(content)
    socketRef.current.emit('note-change', { roomCode, content })
  }

  // Save to MongoDB
  const saveNote = async () => {
    setSaving(true)
    try {
      await axios.post(
        'http://localhost:8000/api/notes/save',
        { roomCode, content: note, title },
        { headers: { Authorization: `Bearer ${token}` } }
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
    <div style={{ height: '100vh', display: 'flex',
      flexDirection: 'column', background: '#f0f2f5' }}>

      {/* Navbar */}
      <div style={{ background: 'white', padding: '0.875rem 1.5rem',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: '600', color: '#185FA5', fontSize: '18px' }}>
            CollabNotes ✏️
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px',
            background: '#f0f2f5', padding: '4px 12px', borderRadius: '20px' }}>
            <span style={{ fontSize: '13px', color: '#666' }}>Room:</span>
            <span style={{ fontWeight: '700', letterSpacing: '2px',
              color: '#185FA5', fontSize: '14px' }}>{roomCode}</span>
            <button onClick={copyCode}
              style={{ background: 'none', border: 'none',
                cursor: 'pointer', fontSize: '13px' }}>
              {copied ? '✅' : '📋'}
            </button>
          </div>
        </div>

        {/* Title input */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ border: 'none', borderBottom: '1px solid #ddd',
            fontSize: '14px', padding: '4px 8px', outline: 'none',
            textAlign: 'center', width: '200px', color: '#333' }}
          placeholder="Note title..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px',
            background: '#EAF3DE', padding: '4px 12px', borderRadius: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%',
              background: '#1D9E75', display: 'inline-block',
              animation: 'pulse 1.5s infinite' }}></span>
            <span style={{ fontSize: '13px', color: '#27500A', fontWeight: '500' }}>
              {users} editing
            </span>
          </div>

          <button onClick={saveNote} disabled={saving}
            style={{ padding: '0.5rem 1rem', background: '#185FA5',
              color: 'white', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontSize: '13px', opacity: saving ? 0.7 : 1 }}>
            {saving ? '⏳ Saving...' : saved ? '✅ Saved!' : '💾 Save'}
          </button>

          <button onClick={() => navigate('/dashboard')}
            style={{ padding: '0.5rem 1rem', background: '#ff4d4f',
              color: 'white', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontSize: '13px' }}>
            Leave Room
          </button>
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, padding: '1.5rem' }}>
        <textarea
          value={note}
          onChange={handleChange}
          placeholder={`Start typing your note here...\n\nShare room code "${roomCode}" with others! 🚀`}
          style={{ width: '100%', height: '100%', padding: '1.5rem',
            fontSize: '16px', lineHeight: '1.7', border: 'none',
            borderRadius: '12px', resize: 'none', outline: 'none',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            fontFamily: 'inherit', color: '#1a1a1a', background: 'white' }}
        />
      </div>
    </div>
  )
}