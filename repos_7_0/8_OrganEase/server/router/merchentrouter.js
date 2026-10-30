const express = require('express');
const Opinion = require('../model/FoodOpiniondb');
const Review =require('../model/Review') // Ensure this matches your model

const router = express.Router();

// Get all food opinions
router.get('/opinions', async (req, res) => {
    try {
        const opinions = await Opinion.find(); // Fetch opinions from the database
        res.json(opinions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching opinions', error });
    }
});

router.get('/reviews/:name', async (req, res) => {
    const { name } = req.params;
    try {
        // Find the opinion by name and populate the reviews field
        const opinion = await Opinion.findOne({ name: { $regex: new RegExp(name, "i") } })
            .populate('reviews'); // This populates the review documents

        if (opinion) {
            // Send only the review array
            res.json({ reviews: opinion.reviews });
        } else {
            res.status(404).json({ message: 'Opinion not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
});

module.exports = router;
