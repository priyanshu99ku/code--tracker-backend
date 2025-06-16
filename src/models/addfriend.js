const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  username: String,
  platform: String,
  email: String
});

// export schema
module.exports = mongoose.model("AddFriendData", friendSchema); 