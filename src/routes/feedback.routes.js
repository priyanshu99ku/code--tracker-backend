const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback');

router.post('/', feedbackController.send_feedback);
router.get('/', feedbackController.show_feedback);

module.exports = router; 