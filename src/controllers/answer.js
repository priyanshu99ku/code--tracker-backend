const Answer = require('../models/answer');
const QuestionData = require('../models/addquestion');

// Add an answer to a question
const addAnswer = async (req, res) => {
    
    try {
        const { questionId } = req.params;
        const { email, name, answer_text } = req.body;

        // Validate required fields
        if (!email || !name || !answer_text) {
            return res.status(400).json({
                success: false,
                message: 'Email, name, and answer text are required'
            });
        }

        const question = await QuestionData.findById(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        const answer = new Answer({
            question: questionId,
            email,
            name,
            answer_text
        });

        const savedAnswer = await answer.save();
        

        question.answers.push(savedAnswer._id);
        await question.save();
        

        res.status(201).json({
            success: true,
            message: 'Answer added successfully',
            data: savedAnswer
        });
    } catch (err) {
        console.error('Error adding answer:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to add answer',
            error: err.message
        });
    }
};

// Get all answers for a specific question
const getAnswersForQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        

        const question = await QuestionData.findById(questionId).populate('answers');

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Answers retrieved successfully',
            data: question.answers
        });

    } catch (err) {
        console.error('Error fetching answers:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve answers',
            error: err.message
        });
    }
};

module.exports = {
    addAnswer,
    getAnswersForQuestion
};
