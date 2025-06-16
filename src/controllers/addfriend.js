const AddFriend = require("../models/addfriend");

// Add friend
const friendadd = async (req, res) => {
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

        // Check if friend already exists
        const existingFriend = await AddFriend.findOne({
            email: req.body.email,
            username: req.body.username,
            platform: req.body.platform
        });

        if (existingFriend) {
            return res.status(400).json({
                success: false,
                message: 'Friend already exists'
            });
        }

        const details = new AddFriend({
            email: req.body.email,
            username: req.body.username,
            platform: req.body.platform,
            date: new Date()
        });

        const savedFriend = await details.save();
        
        res.status(201).json({
            success: true,
            message: 'Friend added successfully',
            data: savedFriend
        });
    } catch (err) {
        console.error('Error adding friend:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to add friend',
            error: err.message
        });
    }
};

// Show friends
const showfriend = async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const friends = await AddFriend.find({ email });
        
        if (friends.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No friends found'
            });
        }

        res.status(200).json({
            success: true,
            count: friends.length,
            data: friends
        });
    } catch (err) {
        console.error('Error fetching friends:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch friends',
            error: err.message
        });
    }
};

// Delete friend
const delete_friend = async (req, res) => {
    try {
        const { email, username, platform } = req.params;
        
        if (!email || !username || !platform) {
            return res.status(400).json({
                success: false,
                message: 'Email, username, and platform are required'
            });
        }

        const deletedFriend = await AddFriend.findOneAndDelete({
            email,
            username,
            platform
        });
        
        if (!deletedFriend) {
            return res.status(404).json({
                success: false,
                message: 'Friend not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Friend deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting friend:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete friend',
            error: err.message
        });
    }
};

module.exports = {
    friendadd,
    showfriend,
    delete_friend
}; 