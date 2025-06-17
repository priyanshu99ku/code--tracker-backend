const StudentProfile = require("../models/studentprofile");
const bcrypt = require('bcryptjs');

// Register new user
const register = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['email', 'password', 'name', 'gender'];
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
        const existingUser = await StudentProfile.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create user with hashed password
        const user = new StudentProfile({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            gender: req.body.gender,
            mobile: req.body.mobile,
            leetcode: req.body.leetcode,
            codechef: req.body.codechef,
            codeforces: req.body.codeforces,
            codeforcesurl: req.body.codeforcesurl,
            leetcodeurl: req.body.leetcodeurl,
            codechefurl: req.body.codechefurl,
            skills: req.body.skills,
            about: req.body.about
        });

        await user.save();

        // Return user data without password
        const { password, ...userData } = user.toObject();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: userData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

// Get profile
const getProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ email: req.query.email });
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        // Remove password from response
        const { password, ...profileData } = profile.toObject();

        res.status(200).json({
            success: true,
            data: profileData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        
        // Validate email format if provided
        if (updates.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updates.email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format'
                });
            }
        }

        const profile = await StudentProfile.findOneAndUpdate(
            { email: req.params.email },
            { $set: updates },
            { new: true }
        );
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        // Remove password from response
        const { password, ...profileData } = profile.toObject();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: profileData
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
    register,
    getProfile,
    updateProfile,
    makeprofile: register,  
    showprofile: getProfile,
    delete_profile: null,   
    update_profile: updateProfile
};