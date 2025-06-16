const express = require('express');
const router = express.Router();
const sortListController = require('../controllers/sortlist');

// Sort List routes
router.post('/', sortListController.addstudent);
router.get('/:email', sortListController.showallstudent);
router.put('/:email/:username', sortListController.update_student_status);
router.delete('/:email/:username', sortListController.delete_student);

module.exports = router; 