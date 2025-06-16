const express = require('express');
const router = express.Router();
const codeforcesController = require('../controllers/codeforcesapi');

// Codeforces API routes
router.get('/user/:username', codeforcesController.codeforcesdata);
router.get('/rating/:username', codeforcesController.get_rating_history);
router.get('/submissions/:username', codeforcesController.get_submissions);
router.delete('/cache/:username', codeforcesController.clear_cache);

module.exports = router; 