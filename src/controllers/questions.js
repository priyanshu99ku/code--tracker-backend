const AddQuestion = require("../models/addquestion");

// Add a new question
const questionadd = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['email', 'question_Description', 'platform', 'topic', 'question_link'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }

        const questionInfo = new AddQuestion({
            email: req.body.email,
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

// Get questions by email
const show_question = async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email parameter is required'
            });
        }

        const questions = await AddQuestion.find({ email });
        
        if (questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No questions found for this email'
            });
        }

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (err) {
        console.error('Error fetching questions:', err);
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

        const deletedQuestion = await AddQuestion.findByIdAndDelete(id);
        
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
        const requiredFields = ['email', 'question_Description', 'platform', 'topic', 'question_link'];
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
            question_Description: req.body.question_Description,
            platform: req.body.platform,
            note: req.body.note,
            topic: req.body.topic,
            question_link: req.body.question_link,
            need_pratice: req.body.need_pratice
        };

        const updatedQuestion = await AddQuestion.findByIdAndUpdate(
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

// Get all questions (new feature)
const get_all_questions = async (req, res) => {
    try {
        const questions = await AddQuestion.find();
        
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

// Search questions (new feature)
const search_questions = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const questions = await AddQuestion.find({
            $or: [
                { question_Description: { $regex: query, $options: 'i' } },
                { topic: { $regex: query, $options: 'i' } },
                { platform: { $regex: query, $options: 'i' } }
            ]
        });

        res.status(200).json({
            success: true,
            count: questions.length,
            query,
            data: questions
        });
    } catch (err) {
        console.error('Error searching questions:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to search questions',
            error: err.message
        });
    }
};

module.exports = {
    questionadd,
    show_question,
    delete_question,
    question_update,
    get_all_questions,
    search_questions
}; 