const express = require('express');
const router = express.Router();
const Event = require('../model/Eventdb');
const Team = require('../model/TeamCollectiondb');
const mongoose = require('mongoose');

// Create a new event
router.post('/createevent', async (req, res) => {
    // Log the request body for debugging
    console.log(req.body);

    // Destructure fields from the request body, matching the schema
    const { eventName, coordinatorName, startDate, endDate, teams } = req.body;

    // Create a new event document
    const event = new Event({
        eventName,          // Matches the schema's field names
        coordinatorName,
        startDate,
        endDate,
        no_of_teams: teams ? teams.length : 0, // Handle case where teams might be undefined
    });

    try {
        // Save the event document
        const savedEvent = await event.save();

        // Save teams if provided
        if (teams && teams.length) {
            const teamPromises = teams.map(async (team) => {
                try {
                    if (!team.name || !team.captainEmail || !team.captainName) {
                        throw new Error('Team data is incomplete: ' + JSON.stringify(team));
                    }

                    const newTeam = new Team({
                        event_id: savedEvent._id,
                        team_name: team.name,
                        head: team.captainEmail,
                        // Reference to the saved event
                        captain_name: team.captainName, // Use the captain's name from the request
                        members: [
                            { member_name: team.captainEmail } // Assuming you want to add the captain as a member
                        ],
                    });
                    await newTeam.save(); // Save the team
                } catch (error) {
                    console.error('Error saving team:', error); // Log team-specific errors
                    throw error; // Rethrow to be caught by Promise.all
                }
            });
            
            // Wait for all team promises to resolve or reject
            await Promise.all(teamPromises);

            // Optionally, log all teams after saving
            console.log('All Teams:', teams);
        }

        // Respond with the saved event and associated teams
        res.status(201).json({ 
            event: savedEvent,
            event_id: savedEvent._id // Send back the event_id
        });
    } catch (error) {
        console.error('Error saving event or teams:', error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
});

router.get('/teams/:id', async (req, res) => {
    const { id } = req.params;

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid event ID format' });
    }

    try {
        // Use findOne to search by event_id instead of _id
        const teams = await Team.find({ event_id: id }).populate('event_id');
        if (!teams) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Populate event details if needed
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Combine team and event details into a single object
        res.json({
            team: teams,
            eventName: event.eventName,
            coordinatorName: event.coordinatorName,
        });
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
