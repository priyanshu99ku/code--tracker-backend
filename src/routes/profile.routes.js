const express = require('express');
const router = express.Router();
const studentProfileController = require('../controllers/studentprofile');

// Student Profile routes
router.post('/', studentProfileController.makeprofile);
router.get('/:email', studentProfileController.showprofile);
router.put('/:email', studentProfileController.update_profile);
router.delete('/:email', studentProfileController.delete_profile);

module.exports = router; 