const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: String,
  jobid: String,
  gender: String
}, {
  timestamps: true
});

module.exports = mongoose.model("TeacherData", teacherSchema); 