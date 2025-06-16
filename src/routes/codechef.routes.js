const express = require('express');
const router = express.Router();
const codechefController = require('../controllers/codechefapi');

router.get('/user/:username', codechefController.codechefdata);
router.get('/rating/:username', codechefController.get_rating_history);
router.get('/contests/:username', codechefController.get_contests);
router.delete('/cache/:username', codechefController.clear_cache);

module.exports = router; 