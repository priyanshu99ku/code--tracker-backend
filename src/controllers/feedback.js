const Feedback = require("../models/feedback");

// Send feedback
const send_feedback = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['email', 'rating', 'comments'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }

        // Validate rating
        const rating = Number(req.body.rating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be a number between 1 and 5'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Validate comments length
        if (req.body.comments.length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Comments must be at least 10 characters long'
            });
        }

        const details = new Feedback({
            email: req.body.email,
            rating: rating,
            comments: req.body.comments,
            date: new Date()
        });

        const savedDetails = await details.save();
        
        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: savedDetails
        });
    } catch (err) {
        console.error('Error submitting feedback:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback',
            error: err.message
        });
    }
};

// Show feedback with pagination
const show_feedback = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const total = await Feedback.countDocuments();

        const feedbackData = await Feedback.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        
        if (feedbackData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No feedback found'
            });
        }

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalFeedback: total,
            data: feedbackData
        });
    } catch (err) {
        console.error('Error fetching feedback:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: err.message
        });
    }
};

module.exports = {
    send_feedback,
    show_feedback
}; 