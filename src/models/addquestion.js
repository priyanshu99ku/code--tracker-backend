const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  question_Description: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    required: true,
    trim: true
  },
  note: String,
  topic: {
    type: String,
    required: true,
    trim: true
  },
  question_link: {
    type: String,
    required: true,
    trim: true
  },
  need_pratice: String,
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("QuestionData", questionSchema);