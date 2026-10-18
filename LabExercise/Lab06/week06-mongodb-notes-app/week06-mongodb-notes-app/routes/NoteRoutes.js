const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/NoteModel');
const { formatDate } = require('../models/NoteModel');

const router = express.Router();

// Accepts { "content": {...} } (as in the README) or a flat body
const getPayload = (req) => {
    const body = req.body || {};
    return body.content && typeof body.content === 'object' ? body.content : body;
};

const handleError = (res, err) => {
    if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message || 'Internal server error' });
};

// Reject malformed ids before hitting the database
const validateId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.noteId)) {
        return res.status(400).send({ message: `Invalid note id: ${req.params.noteId}` });
    }
    next();
};

// CREATE - POST /notes
router.post('/notes', async (req, res) => {
    try {
        const { noteTitle, noteDescription, priority, dateAdded, dateUpdated } = getPayload(req);
        const note = new Note({ noteTitle, noteDescription, priority, dateAdded, dateUpdated });
        const saved = await note.save();
        res.status(201).send(saved);
    } catch (err) {
        handleError(res, err);
    }
});

// READ ALL - GET /notes
router.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.send(notes);
    } catch (err) {
        handleError(res, err);
    }
});

// READ ONE - GET /notes/:noteId
router.get('/notes/:noteId', validateId, async (req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);
        if (!note) {
            return res.status(404).send({ message: `Note not found with id ${req.params.noteId}` });
        }
        res.send(note);
    } catch (err) {
        handleError(res, err);
    }
});

// UPDATE - PUT /notes/:noteId
router.put('/notes/:noteId', validateId, async (req, res) => {
    try {
        const { noteTitle, noteDescription, priority } = getPayload(req);
        const update = { dateUpdated: formatDate() };
        if (noteTitle !== undefined) update.noteTitle = noteTitle;
        if (noteDescription !== undefined) update.noteDescription = noteDescription;
        if (priority !== undefined) update.priority = priority;

        const note = await Note.findByIdAndUpdate(req.params.noteId, update, {
            new: true,
            runValidators: true
        });
        if (!note) {
            return res.status(404).send({ message: `Note not found with id ${req.params.noteId}` });
        }
        res.send(note);
    } catch (err) {
        handleError(res, err);
    }
});

// DELETE - DELETE /notes/:noteId
router.delete('/notes/:noteId', validateId, async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.noteId);
        if (!note) {
            return res.status(404).send({ message: `Note not found with id ${req.params.noteId}` });
        }
        res.send({ message: 'Note deleted successfully!', note });
    } catch (err) {
        handleError(res, err);
    }
});

module.exports = router;