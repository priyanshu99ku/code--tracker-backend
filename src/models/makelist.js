const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  username: String,
  platform: String,
  email: String
}, {
  timestamps: true
});

module.exports = mongoose.model("ListData", listSchema); 