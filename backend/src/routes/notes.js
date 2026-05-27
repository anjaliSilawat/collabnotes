const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();

  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// SAVE NOTE
router.post('/save', auth, async (req, res) => {
  try {
    const { roomCode, content, title } = req.body;

    const note = await Note.findOneAndUpdate(
      {
        roomCode,
        createdBy: req.userId
      },
      {
        content,
        title,
        roomCode,
        createdBy: req.userId
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );

    res.json({
      message: 'Note saved!',
      note
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error
    });
  }
});

// GET ALL NOTES
router.get('/my-notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({
      createdBy: req.userId
    }).sort({ updatedAt: -1 });

    res.json(notes);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error
    });
  }
});

// GET NOTE BY ROOM CODE
router.get('/:roomCode', auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      roomCode: req.params.roomCode,
      createdBy: req.userId
    });

    res.json(note);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error
    });
  }
});

// DELETE NOTE
router.delete('/:id', auth, async (req, res) => {
  try {

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId
    });

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    res.json({
      message: 'Note deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error
    });
  }
});

module.exports = router;