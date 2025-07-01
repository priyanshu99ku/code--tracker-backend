const mongoose = require('mongoose');

// Problem schema representing a Codeforces problem (or similar)
// This is a lightweight version based on problems_old.json structure
const problemSchema = new mongoose.Schema(
  {
    contestId: {
      type: String,
      required: true,
    },
    index: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      required: true,
    },
    frequency: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Problem', problemSchema);
