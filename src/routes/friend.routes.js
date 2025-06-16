const express = require('express');
const router = express.Router();
const addFriendController = require('../controllers/addfriend');

// Add Friend routes
router.post('/', addFriendController.friendadd);
router.get('/:email', addFriendController.showfriend);
router.delete('/:email/:username', addFriendController.delete_friend);

module.exports = router; 