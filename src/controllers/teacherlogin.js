const TeacherLogin = require("../models/teacherlogin");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User registration
const user_register = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['email', 'name', 'password', 'jobid', 'gender'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }

        // Check if user already exists
        const existingUser = await TeacherLogin.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const details = new TeacherLogin({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
            jobid: req.body.jobid,
            gender: req.body.gender
        });

        const savedDetails = await details.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: savedDetails._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                id: savedDetails._id,
                name: savedDetails.name,
                email: savedDetails.email,
                jobid: savedDetails.jobid,
                gender: savedDetails.gender
            },
            token
        });
    } catch (err) {
        console.error('Error in registration:', err);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: err.message
        });
    }
};

// User login
const user_login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await TeacherLogin.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                jobid: user.jobid,
                gender: user.gender
            },
            token
        });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: err.message
        });
    }
};

// Delete account
const delete_account = async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const deletedUser = await TeacherLogin.findOneAndDelete({ email });
        
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully',
            data: {
                id: deletedUser._id,
                name: deletedUser.name,
                email: deletedUser.email
            }
        });
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete account',
            error: err.message
        });
    }
};

// Get user profile (new feature)
const get_profile = async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await TeacherLogin.findOne({ email }).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: err.message
        });
    }
};

// Update profile (new feature)
const update_profile = async (req, res) => {
    try {
        const { email } = req.params;
        const updates = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Don't allow email update
        delete updates.email;

        // If password is being updated, hash it
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const updatedUser = await TeacherLogin.findOneAndUpdate(
            { email },
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: err.message
        });
    }
};

module.exports = {
    user_register,
    user_login,
    delete_account,
    get_profile,
    update_profile
}; 