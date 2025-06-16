const fetch = require('node-fetch');

// Fetch upcoming contests
const contestdata = async (req, res) => {
    try {
        const response = await fetch('https://competeapi.vercel.app/contests/upcoming');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format the response
        const formattedData = {
            success: true,
            timestamp: new Date().toISOString(),
            data: data,
            message: 'Contest data fetched successfully'
        };
        
        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error fetching contest data:', error);
        
        res.status(500).json({
            success: false,
            timestamp: new Date().toISOString(),
            error: {
                message: 'Failed to fetch contest data',
                details: error.message
            }
        });
    }
};

// Fetch contests by platform
const getContestsByPlatform = async (req, res) => {
    const { platform } = req.params;
    
    try {
        const response = await fetch('https://competeapi.vercel.app/contests/upcoming');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter contests by platform
        const filteredContests = data.filter(contest => 
            contest.platform.toLowerCase() === platform.toLowerCase()
        );
        
        const formattedData = {
            success: true,
            timestamp: new Date().toISOString(),
            platform: platform,
            count: filteredContests.length,
            data: filteredContests,
            message: `Contests for ${platform} fetched successfully`
        };
        
        res.status(200).json(formattedData);
    } catch (error) {
        console.error(`Error fetching contests for platform ${platform}:`, error);
        
        res.status(500).json({
            success: false,
            timestamp: new Date().toISOString(),
            error: {
                message: `Failed to fetch contests for ${platform}`,
                details: error.message
            }
        });
    }
};

// Search contests
const searchContests = async (req, res) => {
    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({
            success: false,
            timestamp: new Date().toISOString(),
            error: {
                message: 'Search query is required'
            }
        });
    }
    
    try {
        const response = await fetch('https://competeapi.vercel.app/contests/upcoming');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Search in contest names and platforms
        const searchResults = data.filter(contest => 
            contest.name.toLowerCase().includes(query.toLowerCase()) ||
            contest.platform.toLowerCase().includes(query.toLowerCase())
        );
        
        const formattedData = {
            success: true,
            timestamp: new Date().toISOString(),
            query: query,
            count: searchResults.length,
            data: searchResults,
            message: 'Search completed successfully'
        };
        
        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error searching contests:', error);
        
        res.status(500).json({
            success: false,
            timestamp: new Date().toISOString(),
            error: {
                message: 'Failed to search contests',
                details: error.message
            }
        });
    }
};

module.exports = {
    contestdata,
    getContestsByPlatform,
    searchContests
};
