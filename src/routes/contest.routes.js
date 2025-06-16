const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contest');
const feedbackController = require('../controllers/feedback');

router.get('/', contestController.contestdata);
router.get('/platform/:platform', contestController.getContestsByPlatform);
router.get('/search', contestController.searchContests);

router.post('/feedback', feedbackController.send_feedback);
router.get('/feedback', feedbackController.show_feedback);

module.exports = router; 