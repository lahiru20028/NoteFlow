const express = require('express');
const router = express.Router();
const { 
    createNote, 
    getNotes, 
    updateNote, 
    shareNote 
} = require('../controllers/noteController');
const { protect } = require('../middleware/auth.js');

// All routes here are protected - require login
router.use(protect);

// @route   GET & POST /api/notes
router.route('/')
    .get(getNotes)
    .post(createNote);

// @route   PUT /api/notes/:id
router.route('/:id')
    .put(updateNote);

// @route   POST /api/notes/:id/share
router.post('/:id/share', shareNote);

module.exports = router;