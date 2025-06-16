const mongoose = require('mongoose');

const loginDetailSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String
  }
}, {
  timestamps: true
});

const LoginDetail = mongoose.model('LoginDetail', loginDetailSchema);
module.exports = LoginDetail;