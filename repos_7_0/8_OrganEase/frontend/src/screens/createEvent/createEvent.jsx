import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateEventPage = () => {
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [teams, setTeams] = useState([{ name: '', captainName: '', captainEmail: '' }]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addTeam = () => {
    setTeams([...teams, { name: '', captainName: '', captainEmail: '' }]);
  };

  const updateTeam = (index, field, value) => {
    const updatedTeams = [...teams];
    updatedTeams[index][field] = value;
    setTeams(updatedTeams);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const coordinatorName = 'finson'; // Set the coordinator name
    const newEvent = { eventName, coordinatorName, startDate, endDate, teams };

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/createevent', newEvent);

      // Save the JWT token to local storage
      if (response.data.token) {
        localStorage.setItem('jwtToken', response.data.token);
      }

      // Navigate to the team details page with the event ID
      navigate(`/team/${response.data.event_id}`); // Update to navigate with event ID
    } catch (err) {
      setError('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/'); // Navigate to the home page when canceled
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Create New Event</h2>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="eventName">
            Event Name
          </label>
          <input
            id="eventName"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="startDate">
              Start Date
            </label>
            <div className="relative">
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="endDate">
              End Date
            </label>
            <div className="relative">
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teams
          </label>
          {teams.map((team, index) => (
            <div key={index} className="space-y-2 mb-4">
              <input
                type="text"
                placeholder={`Team ${index + 1} Name`}
                value={team.name}
                onChange={(e) => updateTeam(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder={`Team ${index + 1} Captain Name`}
                value={team.captainName}
                onChange={(e) => updateTeam(index, 'captainName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="email"
                placeholder={`Team ${index + 1} Captain Email`}
                value={team.captainEmail}
                onChange={(e) => updateTeam(index, 'captainEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addTeam}
            className="mt-2 flex items-center text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Team
          </button>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            <Plus className="mr-2 h-5 w-5" />
            {loading ? 'Creating...' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-md flex items-center justify-center"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;
