const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

const app = express();
const httpServer = http.createServer(app);

// CORS — sabse pehle
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://collabnotes-liard.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('MongoDB error:', err));

// Routes — CORS ke baad
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://collabnotes-liard.vercel.app'
    ],
    methods: ['GET', 'POST']
  }
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomCode) => {
    socket.join(roomCode);
    console.log(`User ${socket.id} joined room: ${roomCode}`);
    socket.to(roomCode).emit('user-joined', socket.id);
  });

  socket.on('note-change', ({ roomCode, content }) => {
    socket.to(roomCode).emit('note-change', content);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});