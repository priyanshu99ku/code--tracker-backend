const express = require('express');
const router = express.Router();
const studentProfileController = require('../controllers/studentprofile');

// Register new user
router.post('/register', studentProfileController.register);

// Get profile
router.get('/profile', studentProfileController.getProfile);

// Update profile
router.patch('/profile/:email', studentProfileController.updateProfile);

// Legacy routes for compatibility
router.post('/', studentProfileController.makeprofile);
router.get('/:email', studentProfileController.showprofile);
router.patch('/:email', studentProfileController.update_profile);

module.exports = router;