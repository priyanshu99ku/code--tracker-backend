const SortList = require("../models/sortlist");

// Add student
const addstudent = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['email', 'username', 'status'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }

        // Validate status value
        const validStatuses = ['selected', 'rejected', 'pending'];
        if (!validStatuses.includes(req.body.status.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value',
                validStatuses
            });
        }

        // Check if student already exists
        const existingStudent = await SortList.findOne({
            email: req.body.email,
            username: req.body.username
        });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Student already exists'
            });
        }

        const details = new SortList({
            email: req.body.email,
            username: req.body.username,
            status: req.body.status.toLowerCase(),
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

        const students = await SortList.find({ email }).sort({ date: -1 });
        
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
        const { email, username } = req.params;
        
        if (!email || !username) {
            return res.status(400).json({
                success: false,
                message: 'Email and username are required'
            });
        }

        const deletedStudent = await SortList.findOneAndDelete({
            email,
            username
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

// Update student status
const update_student_status = async (req, res) => {
    try {
        const { email, username } = req.params;
        const { status } = req.body;
        
        if (!email || !username || !status) {
            return res.status(400).json({
                success: false,
                message: 'Email, username, and status are required'
            });
        }

        // Validate status value
        const validStatuses = ['selected', 'rejected', 'pending'];
        if (!validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value',
                validStatuses
            });
        }

        const updatedStudent = await SortList.findOneAndUpdate(
            { email, username },
            { 
                $set: { 
                    status: status.toLowerCase(),
                    date: new Date()
                }
            },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student status updated successfully',
            data: updatedStudent
        });
    } catch (err) {
        console.error('Error updating student status:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to update student status',
            error: err.message
        });
    }
};

module.exports = {
    addstudent,
    showallstudent,
    delete_student,
    update_student_status
}; 