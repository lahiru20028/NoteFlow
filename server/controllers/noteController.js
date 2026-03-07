const Note = require('../models/Note');
const User = require('../models/User');

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await Note.create({
            title,
            content,
            owner: req.user._id
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all notes for logged in user (owned or collaborating)
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {
            $or: [
                { owner: req.user._id },
                { collaborators: req.user._id }
            ]
        };

        // Full-text partial search logic via regex
        if (search) {
            query = {
                $and: [
                    query, // Must be owner or collaborator
                    {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { content: { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            };
        }

        const notes = await Note.find(query).populate('owner', 'name email');
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ message: 'Note not found' });

        // Check if user is owner or collaborator
        if (note.owner.toString() !== req.user._id.toString() &&
            !note.collaborators.includes(req.user._id)) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a collaborator to a note
// @route   POST /api/notes/:id/share
// @access  Private
const shareNote = async (req, res) => {
    try {
        const { email } = req.body;
        const note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ message: 'Note not found' });
        if (note.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Only owner can share' });
        }

        const userToShare = await User.findOne({ email });
        if (!userToShare) return res.status(404).json({ message: 'User not found' });

        if (!note.collaborators.includes(userToShare._id)) {
            note.collaborators.push(userToShare._id);
            await note.save();
        }

        res.json({ message: 'Note shared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ message: 'Note not found' });

        // Only the owner can delete the note
        if (note.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete' });
        }

        await note.deleteOne();
        res.json({ message: 'Note removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNote,
    getNotes,
    updateNote,
    shareNote,
    deleteNote
};