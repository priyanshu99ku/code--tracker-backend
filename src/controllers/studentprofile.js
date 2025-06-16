const StudentProfile = require("../models/studentprofile");

// Make profile
const makeprofile = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['email', 'name', 'gender', 'mobile'];
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

        // Validate mobile number
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(req.body.mobile)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid mobile number format (10 digits required)'
            });
        }

        // Check if profile already exists
        const existingProfile = await StudentProfile.findOne({ email: req.body.email });
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: 'Profile already exists for this email'
            });
        }

        const details = new StudentProfile({
            email: req.body.email,
            name: req.body.name,
            gender: req.body.gender,
            codechef: req.body.codechef,
            codeforces: req.body.codeforces,
            leetcode: req.body.leetcode,
            codechefurl: req.body.codechefurl,
            codeforcesurl: req.body.codeforcesurl,
            leetcodeurl: req.body.leetcodeurl,
            language: req.body.language,
            address: req.body.address,
            mobile: req.body.mobile,
            skill: req.body.skill,
            profession: req.body.profession,
            designation: req.body.designation,
            date: new Date()
        });

        const savedProfile = await details.save();
        
        res.status(201).json({
            success: true,
            message: 'Profile created successfully',
            data: savedProfile
        });
    } catch (err) {
        console.error('Error creating profile:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to create profile',
            error: err.message
        });
    }
};

// Show profile
const showprofile = async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await StudentProfile.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
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

// Delete profile
const delete_profile = async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const deletedProfile = await StudentProfile.findOneAndDelete({ email });
        
        if (!deletedProfile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting profile:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete profile',
            error: err.message
        });
    }
};

// Update profile
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

        // Validate mobile number if provided
        if (updates.mobile) {
            const mobileRegex = /^[0-9]{10}$/;
            if (!mobileRegex.test(updates.mobile)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid mobile number format (10 digits required)'
                });
            }
        }

        // Remove email from updates to prevent changing it
        delete updates.email;

        const updatedProfile = await StudentProfile.findOneAndUpdate(
            { email },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile
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
    makeprofile,
    showprofile,
    delete_profile,
    update_profile
}; 