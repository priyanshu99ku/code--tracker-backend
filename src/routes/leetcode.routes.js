const express = require('express');
const router = express.Router();
const leetcodeController = require('../controllers/leetcodeapi');

// LeetCode API routes
router.get('/user/:username', leetcodeController.leetcodedata);
router.get('/submissions/:username', leetcodeController.get_submission_stats);
router.get('/recent/:username', leetcodeController.get_recent_submissions);
router.get('/contests/:username', leetcodeController.get_contest_history);
router.delete('/cache/:username', leetcodeController.clear_cache);

module.exports = router; 