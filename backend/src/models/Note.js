const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Note'
  }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);