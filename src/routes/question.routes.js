const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questions');
const answerController = require('../controllers/answer');



router.post('/', questionsController.questionadd);
router.get('/', questionsController.get_all_questions);
router.delete('/:id', questionsController.delete_question);
router.put('/:id', questionsController.question_update);

// Add an answer to a question
router.post('/:questionId/answers', answerController.addAnswer);

// Get all answers for a question
router.get('/:questionId/answers', answerController.getAnswersForQuestion);

module.exports = router; 