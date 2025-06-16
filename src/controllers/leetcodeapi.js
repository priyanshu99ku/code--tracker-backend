const { default: axios } = require("axios");

// Cache for storing API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Get LeetCode user data
const leetcodedata = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        // Check cache first
        const cachedData = cache.get(username);
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
            return res.status(200).json({
                success: true,
                message: 'Data retrieved from cache',
                data: cachedData.data,
                cached: true
            });
        }

        // Make API request
        const response = await axios.get(`https://competeapi.vercel.app/user/leetcode/${username}`, {
            timeout: 10000 // 10 second timeout
        });

        // Validate response data
        if (!response.data) {
            throw new Error('Invalid response from LeetCode API');
        }

        // Store in cache
        cache.set(username, {
            data: response.data,
            timestamp: Date.now()
        });

        res.status(200).json({
            success: true,
            message: 'Data retrieved successfully',
            data: response.data,
            cached: false
        });
    } catch (err) {
        console.error('Error fetching LeetCode data:', err);

        // Handle specific error cases
        if (err.response) {
            // API returned an error response
            return res.status(err.response.status).json({
                success: false,
                message: 'LeetCode API error',
                error: err.response.data
            });
        } else if (err.request) {
            // Request was made but no response received
            return res.status(503).json({
                success: false,
                message: 'LeetCode API is not responding',
                error: 'Service unavailable'
            });
        } else if (err.code === 'ECONNABORTED') {
            // Request timeout
            return res.status(504).json({
                success: false,
                message: 'Request to LeetCode API timed out',
                error: 'Gateway timeout'
            });
        }

        // Generic error
        res.status(500).json({
            success: false,
            message: 'Failed to fetch LeetCode data',
            error: err.message
        });
    }
};

// Get LeetCode user submission stats (new feature)
const get_submission_stats = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        const response = await axios.get(`https://competeapi.vercel.app/user/leetcode/${username}/submission-stats`, {
            timeout: 10000
        });

        res.status(200).json({
            success: true,
            message: 'Submission stats retrieved successfully',
            data: response.data
        });
    } catch (err) {
        console.error('Error fetching submission stats:', err);
        handleApiError(err, res);
    }
};

// Get LeetCode user recent submissions (new feature)
const get_recent_submissions = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        const response = await axios.get(`https://competeapi.vercel.app/user/leetcode/${username}/recent-submissions`, {
            timeout: 10000
        });

        res.status(200).json({
            success: true,
            message: 'Recent submissions retrieved successfully',
            data: response.data
        });
    } catch (err) {
        console.error('Error fetching recent submissions:', err);
        handleApiError(err, res);
    }
};

// Get LeetCode user contest history (new feature)
const get_contest_history = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        const response = await axios.get(`https://competeapi.vercel.app/user/leetcode/${username}/contest-history`, {
            timeout: 10000
        });

        res.status(200).json({
            success: true,
            message: 'Contest history retrieved successfully',
            data: response.data
        });
    } catch (err) {
        console.error('Error fetching contest history:', err);
        handleApiError(err, res);
    }
};

// Clear cache for a specific user (new feature)
const clear_cache = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        const deleted = cache.delete(username);

        res.status(200).json({
            success: true,
            message: deleted ? 'Cache cleared successfully' : 'No cache found for this user',
            username
        });
    } catch (err) {
        console.error('Error clearing cache:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to clear cache',
            error: err.message
        });
    }
};

// Helper function to handle API errors
const handleApiError = (err, res) => {
    if (err.response) {
        return res.status(err.response.status).json({
            success: false,
            message: 'LeetCode API error',
            error: err.response.data
        });
    } else if (err.request) {
        return res.status(503).json({
            success: false,
            message: 'LeetCode API is not responding',
            error: 'Service unavailable'
        });
    } else if (err.code === 'ECONNABORTED') {
        return res.status(504).json({
            success: false,
            message: 'Request to LeetCode API timed out',
            error: 'Gateway timeout'
        });
    }

    res.status(500).json({
        success: false,
        message: 'Failed to fetch data from LeetCode API',
        error: err.message
    });
};

module.exports = {
    leetcodedata,
    get_submission_stats,
    get_recent_submissions,
    get_contest_history,
    clear_cache
}; 