const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch((err) => console.log('Database Connection Error:', err));

app.get('/', (req, res) => {
    res.send('NoteFlow API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});