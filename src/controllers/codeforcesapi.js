const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Cache for storing API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Get Codeforces user data
const codeforcesdata = async (req, res) => {
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

        // Make API request with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        // Get user info
        const response = await fetch(`https://competeapi.vercel.app/user/codeforces/${username}`, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Validate response data
        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid response from Codeforces API');
        }

        // Store in cache
        cache.set(username, {
            data: data[0],
            timestamp: Date.now()
        });

        res.status(200).json({
            success: true,
            message: 'Data retrieved successfully',
            data: data[0],
            cached: false
        });
    } catch (err) {
        console.error('Error fetching Codeforces data:', err);

        // Handle specific error cases
        if (err.name === 'AbortError') {
            return res.status(504).json({
                success: false,
                message: 'Request to Codeforces API timed out',
                error: 'Gateway timeout'
            });
        }

        // Generic error
        res.status(500).json({
            success: false,
            message: 'Failed to fetch Codeforces data',
            error: err.message
        });
    }
};

// Get Codeforces user rating history (new feature)
const get_rating_history = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`https://competeapi.vercel.app/user/codeforces/${username}/rating-history`, {
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        res.status(200).json({
            success: true,
            message: 'Rating history retrieved successfully',
            data
        });
    } catch (err) {
        console.error('Error fetching rating history:', err);
        handleApiError(err, res);
    }
};

// Get Codeforces user submissions (new feature)
const get_submissions = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`https://competeapi.vercel.app/user/codeforces/${username}/submissions`, {
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        res.status(200).json({
            success: true,
            message: 'Submissions retrieved successfully',
            data
        });
    } catch (err) {
        console.error('Error fetching submissions:', err);
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
    if (err.name === 'AbortError') {
        return res.status(504).json({
            success: false,
            message: 'Request to Codeforces API timed out',
            error: 'Gateway timeout'
        });
    }

    res.status(500).json({
        success: false,
        message: 'Failed to fetch data from Codeforces API',
        error: err.message
    });
};

module.exports = {
    codeforcesdata,
    get_rating_history,
    get_submissions,
    clear_cache
}; 