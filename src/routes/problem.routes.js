const express = require('express');
const router = express.Router();

const problemsController = require('../controllers/problems');

// GET /problems?rating=800 OR /problems?minRating=800&maxRating=1200&tag=graphs,dp
router.get('/', problemsController.getProblems);

module.exports = router;
