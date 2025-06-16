require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const codeforcesRoutes = require('./src/routes/codeforces.routes');
const leetcodeRoutes = require('./src/routes/leetcode.routes');
const feedbackRoutes = require('./src/routes/feedback.routes');
const loginRoutes = require('./src/routes/login.routes');
const profileRoutes = require('./src/routes/profile.routes');
const friendRoutes = require('./src/routes/friend.routes');
const listRoutes = require('./src/routes/list.routes');
const sortRoutes = require('./src/routes/sort.routes');
const codechefRoutes = require('./src/routes/codechef.routes');
const teacherloginRoutes = require('./src/routes/teacherlogin.routes');
const questionRoutes = require('./src/routes/question.routes');
const contestRoutes = require('./src/routes/contest.routes');

const app = express();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected!'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/codeforces', codeforcesRoutes);
app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api', loginRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/friend', friendRoutes);
app.use('/api/list', listRoutes);
app.use('/api/sort', sortRoutes);
app.use('/api/codechef', codechefRoutes);
app.use('/api/teacherlogin', teacherloginRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/contest', contestRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 