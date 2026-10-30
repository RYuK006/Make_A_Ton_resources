import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Team Card Component
const TeamCard = ({ team, showCheckbox, isChecked, onCheckboxChange }) => {
  const navigate = useNavigate();
  const {id} = useParams();
  const handleCardClick = (e) => {
    if (e.target.type !== 'checkbox') {
      // alert(`Team: ${team.team_name}, Captain: ${team.captain_name}`);
      navigate(`/team/${id}/chat`)
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-gray-200 border border-white shadow-lg rounded-lg p-4 w-full flex items-center justify-between cursor-pointer hover:bg-gray-300"
    >
      <div>
        <h3 className="text-lg font-semibold mb-2 text-black w-full">{team.team_name}</h3>
        <p className="text-gray-700">Captain: {team.captain_name}</p>
        <p className="text-gray-700">Total Members: {team.members ? team.members.length : 0}</p>
      </div>
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onCheckboxChange(team.team_name)}
          onClick={(e) => e.stopPropagation()} // Prevent parent click event
          className="ml-2 transform scale-150"
          aria-label={`Select team ${team.team_name}`}
        />
      )}
    </div>
  );
};

// Team Listing Component
const TeamListing = () => {
  const { id } = useParams();
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [teamData, setTeamData] = useState([]); // Initialize as empty array
  const [eventName, setEventName] = useState('N/A'); // Separate state for event name
  const [coordinatorName, setCoordinatorName] = useState('N/A'); // Separate state for coordinator name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`/api/teams/${id}`);
        console.log('Response data:', response.data);
        
        // Update state based on API response structure
        setTeamData(response.data.team || []); // Assuming teams are in the 'team' field
        setEventName(response.data.eventName || 'N/A'); // Assuming eventName field is part of the response
        setCoordinatorName(response.data.coordinatorName || 'N/A'); // Assuming coordinatorName is part of the response
      } catch (error) {
        setError('Failed to load teams');
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [id]);

  const handleAlertClick = () => {
    axios
      .post(`/api/listing/${id}`, {
        selectedTeams,
        message: inputMessage,
      })
      .then((response) => {
        console.log('Success:', response.data);
        setShowCheckboxes(false);
        setSelectedTeams([]);
        setInputMessage('');
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    setShowCheckboxes(true);
  };

  const handleCancelClick = () => {
    setShowCheckboxes(false);
    setSelectedTeams([]);
    setInputMessage('');
  };

  const handleCheckboxChange = (teamName) => {
    setSelectedTeams((prevSelectedTeams) =>
      prevSelectedTeams.includes(teamName)
        ? prevSelectedTeams.filter((name) => name !== teamName)
        : [...prevSelectedTeams, teamName]
    );
  };

  if (loading) return <div className="text-center text-lg">Loading teams...</div>;
  if (error) return <div className="text-center text-lg text-red-500">{error}</div>;

  return (
    <div className="bg-white">
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-blue-600">Events Pro</h1>
        <div className="text-gray-700">{today}</div>
      </header>

      <div className="mt-4 shadow-md border border-gray-300 rounded-md p-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-left">Event name: {eventName}</h2>
          <h2 className="text-xl font-semibold text-left mt-2">Event Coordinator: {coordinatorName}</h2>
        </div>
        {showCheckboxes ? (
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Enter message"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
              aria-label="Enter message"
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600"
              onClick={handleCancelClick}
              aria-label="Cancel selection"
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
              onClick={handleAlertClick}
              aria-label="Alert selected teams"
            >
              Alert
            </button>
          </div>
        ) : (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
            onClick={handleAlertClick}
            aria-label="Alert selected teams"
          >
            Alert
          </button>
        )}
      </div>

      <h2 className="text-2xl font-semibold text-left mt-4 mb-2 ml-4">Organising Teams</h2>

      <div className="p-6 w-full">
        <div className="flex flex-col gap-6 justify-center w-full">
          {teamData.length > 0 ? (
            teamData.map((team) => (
              <TeamCard
                key={team._id} // Use unique identifier for key
                team={team} // Pass the team object
                showCheckbox={showCheckboxes}
                isChecked={selectedTeams.includes(team.team_name)}
                onCheckboxChange={handleCheckboxChange}
              />
            ))
          ) : (
            <div>No teams found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamListing;
