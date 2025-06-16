const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questions');

router.post('/', questionsController.questionadd);
router.get('/:email', questionsController.show_question);
router.delete('/:id', questionsController.delete_question);
router.put('/:id', questionsController.question_update);

module.exports = router; 