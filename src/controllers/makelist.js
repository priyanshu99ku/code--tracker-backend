const MakeList = require("../models/makelist");

// Add student
const addstudent = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['email', 'username', 'platform'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }

        // Check if student already exists
        const existingStudent = await MakeList.findOne({
            email: req.body.email,
            username: req.body.username,
            platform: req.body.platform
        });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Student already exists'
            });
        }

        const details = new MakeList({
            email: req.body.email,
            username: req.body.username,
            platform: req.body.platform,
            date: new Date()
        });

        const savedStudent = await details.save();
        
        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            data: savedStudent
        });
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to add student',
            error: err.message
        });
    }
};

// Show all students
const showallstudent = async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const students = await MakeList.find({ email });
        
        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No students found'
            });
        }

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch students',
            error: err.message
        });
    }
};

// Delete student
const delete_student = async (req, res) => {
    try {
        const { email, username, platform } = req.params;
        
        if (!email || !username || !platform) {
            return res.status(400).json({
                success: false,
                message: 'Email, username, and platform are required'
            });
        }

        const deletedStudent = await MakeList.findOneAndDelete({
            email,
            username,
            platform
        });
        
        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete student',
            error: err.message
        });
    }
};

module.exports = {
    addstudent,
    showallstudent,
    delete_student
}; 