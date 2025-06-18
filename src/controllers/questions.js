const QuestionData = require("../models/addquestion");

// Add a new question
const questionadd = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['email', 'name', 'question_Description', 'platform', 'topic', 'question_link'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }

        const questionInfo = new QuestionData({
            email: req.body.email,
            name: req.body.name,
            question_Description: req.body.question_Description,
            platform: req.body.platform,
            note: req.body.note,
            topic: req.body.topic,
            question_link: req.body.question_link,
            need_pratice: req.body.need_pratice
        });

        const savedQuestion = await questionInfo.save();
        
        res.status(201).json({
            success: true,
            message: 'Question added successfully',
            data: savedQuestion
        });
    } catch (err) {
        console.error('Error adding question:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to add question',
            error: err.message
        });
    }
};

// Get all questions
const get_all_questions = async (req, res) => {
    try {
        const questions = await QuestionData.find().populate('answers');
        
        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (err) {
        console.error('Error fetching all questions:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch questions',
            error: err.message
        });
    }
};

// Delete a question
const delete_question = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Question ID is required'
            });
        }

        const deletedQuestion = await QuestionData.findByIdAndDelete(id);
        
        if (!deletedQuestion) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Question deleted successfully',
            data: deletedQuestion
        });
    } catch (err) {
        console.error('Error deleting question:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete question',
            error: err.message
        });
    }
};

// Update a question
const question_update = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Question ID is required'
            });
        }

        // Validate required fields
        const requiredFields = ['email', 'name', 'question_Description', 'platform', 'topic', 'question_link'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }

        const questionUpdate = {
            email: req.body.email,
            name: req.body.name,
            question_Description: req.body.question_Description,
            platform: req.body.platform,
            note: req.body.note,
            topic: req.body.topic,
            question_link: req.body.question_link,
            need_pratice: req.body.need_pratice
        };

        const updatedQuestion = await QuestionData.findByIdAndUpdate(
            id,
            questionUpdate,
            { new: true, runValidators: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Question updated successfully',
            data: updatedQuestion
        });
    } catch (err) {
        console.error('Error updating question:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to update question',
            error: err.message
        });
    }
};

module.exports = {
    questionadd,
    get_all_questions,
    delete_question,
    question_update
};