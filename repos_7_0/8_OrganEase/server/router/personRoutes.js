const express = require('express');
const router = express.Router();
const Person = require('../models/person');

// Add a new person
router.post('/add', async (req, res) => {
  const { id, event_id, username, role, team_name } = req.body;
  try {
    const person = new Person({ id, event_id, username, role, team_name });
    await person.save();
    res.status(201).json(person);
  } catch (err) {
    res.status(400).json({ message: 'Error adding person', error: err.message });
  }
});

// Get all persons for a specific event
router.get('/:event_id', async (req, res) => {
  const { event_id } = req.params;
  try {
    const persons = await Person.find({ event_id });
    res.status(200).json(persons);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching persons', error: err.message });
  }
});

// Update a person's role
router.put('/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const person = await Person.findByIdAndUpdate(id, { role }, { new: true });
    res.status(200).json(person);
  } catch (err) {
    res.status(400).json({ message: 'Error updating role', error: err.message });
  }
});

module.exports = router;
