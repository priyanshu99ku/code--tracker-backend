const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    required: true
  },
  jobid: {
    type: String,
    required: function() { return this.role === 'teacher'; }
  },
  gender: {
    type: String,
    required: true
  },
  mobile: {
    type: String
  },
  leetcode: {
    type: String
  },
  codechef: {
    type: String
  },
  codeforces: {
    type: String
  },
  codeforcesurl: {
    type: String
  },
  leetcodeurl: {
    type: String
  },
  codechefurl: {
    type: String
  },
  skills: {
    type: String
  },
  about: {
    type: String
  }
}, {
  timestamps: true
});

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
module.exports = StudentProfile; 