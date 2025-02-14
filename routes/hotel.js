const express = require('express');
const Hotel = require('../models/hotel');

const router = express.Router();

// Create a hotel
router.post('/', async (req, res) => {
    const { name, address, rooms, rating } = req.body;
    
    try {
        const newHotel = new Hotel({ name, address, rooms, rating });
        const savedHotel = await newHotel.save();
        res.status(201).json(savedHotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all hotels
router.get('/', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single hotel
router.get('/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
        res.json(hotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a hotel
router.put('/:id', async (req, res) => {
    const { name, address, rooms, rating } = req.body;
    
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, 
            { name, address, rooms, rating }, 
            { new: true }
        );
        if (!updatedHotel) return res.status(404).json({ message: 'Hotel not found' });
        res.json(updatedHotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a hotel
router.delete('/:id', async (req, res) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!deletedHotel) return res.status(404).json({ message: 'Hotel not found' });
        res.json({ message: 'Hotel deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;