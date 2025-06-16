const express = require('express');
const router = express.Router();
const makeListController = require('../controllers/makelist');

// Make List routes
router.post('/', makeListController.addstudent);
router.get('/:email', makeListController.showallstudent);
router.delete('/:email/:username', makeListController.delete_student);

module.exports = router; 