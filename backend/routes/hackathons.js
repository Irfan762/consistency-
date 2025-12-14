const express = require('express');
const router = express.Router();
const Hackathon = require('../models/Hackathon');

// GET all hackathons
router.get('/', async (req, res) => {
    try {
        const hackathons = await Hackathon.find().sort({ startDate: 1 });
        res.json(hackathons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new hackathon
router.post('/', async (req, res) => {
    const hackathon = new Hackathon(req.body);
    try {
        const newHackathon = await hackathon.save();
        res.status(201).json(newHackathon);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (update) a hackathon
router.put('/:id', async (req, res) => {
    try {
        const hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });
        res.json(hackathon);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a hackathon
router.delete('/:id', async (req, res) => {
    try {
        const hackathon = await Hackathon.findByIdAndDelete(req.params.id);
        if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });
        res.json({ message: 'Hackathon deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
