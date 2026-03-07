const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(cors()); // To allow cross-origin requests from Frontend

// Routes Middleware
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('NoteFlow API is running successfully...');
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    // Add these options for stability and bypass DNS issues
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => {
        console.log('MongoDB Connected Successfully');
    })
    .catch((err) => {
        console.error('Database Connection Error:', err.message);
        // Do not crash immediately on local DNS drops; let nodemon or user retry
    });

// Start listening regardless of DB connection status
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});