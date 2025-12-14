require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('./routes/tasks');
const hackathonRoutes = require('./routes/hackathons');
const { initScheduler, sendDailyNotifications } = require('./services/notificationService');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon-hero';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Initialize Notification Scheduler
initScheduler();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/hackathons', hackathonRoutes);

// Test Notification Route
app.post('/api/notifications/test', async (req, res) => {
    try {
        await sendDailyNotifications(true);
        res.json({ message: 'Notification check triggered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to trigger notifications' });
    }
});

// Base route
app.get('/', (req, res) => {
    res.send('Hackathon Hero Backend is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
