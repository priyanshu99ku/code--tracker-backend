const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  rating: {
    type: Number
  },
  comments: {
    type: String
  }
}, {
  timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback; 