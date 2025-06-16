const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String
  },
  codechef: {
    type: String
  },
  codeforces: {
    type: String
  },
  leetcode: {
    type: String
  },
  codechefurl: {
    type: String
  },
  codeforcesurl: {
    type: String
  },
  leetcodeurl: {
    type: String
  },
  language: {
    type: String
  },
  address: {
    type: String
  },
  mobile: {
    type: Number
  },
  skill: {
    type: String
  },
  profession: {
    type: String
  },
  designation: {
    type: String
  }
}, {
  timestamps: true
});

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
module.exports = StudentProfile; 