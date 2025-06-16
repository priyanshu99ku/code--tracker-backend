const mongoose = require('mongoose');

const sortSchema = new mongoose.Schema({
  username: String,
  status: String,
  email: String,
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("SortData", sortSchema); 