const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  id: { type: String, required: true },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  username: { type: String, required: true },
  role: { type: String, required: true },  // e.g., 'Coordinator', 'Team Member'
  team_name: { type: String, required: true }  // Team to which the person belongs
});

module.exports = mongoose.model('Person', personSchema);
