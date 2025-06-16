const LoginDetails = require("../models/logindetail");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User registration
const user_register = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['email', 'name', 'password', 'gender'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
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

        // Check if user already exists
        const existingUser = await LoginDetails.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Validate password strength
        if (req.body.password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const details = new LoginDetails({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
            gender: req.body.gender,
            date: new Date()
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
            message: 'User registered successfully',
            token,
            user: {
                id: savedDetails._id,
                email: savedDetails.email,
                name: savedDetails.name,
                gender: savedDetails.gender
            }
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to register user',
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

        // Find user by email
        const user = await LoginDetails.findOne({ email });
        
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
                message: 'Invalid password'
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
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                gender: user.gender
            }
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to login',
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

        const deletedUser = await LoginDetails.findOneAndDelete({ email });
        
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
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

module.exports = {
    user_register,
    user_login,
    delete_account
}; 