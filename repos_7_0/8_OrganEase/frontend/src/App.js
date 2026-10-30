import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import HomePage from './screens/HomePage/homepage';
import CreateEventPage from './screens/createEvent/createEvent';
import FoodOpinionPage from './screens/merchant/HomePage';
import ReviewPage from './screens/merchant/Review';
import TeamListing from './screens/team_listing/team_listing.jsx';
import GroupChat from "./screens/groupChat/groupChat.jsx"

import { Buffer } from 'buffer';
window.Buffer = Buffer; // Make Buffer available globally

// Set the base URL for Axios
axios.defaults.baseURL = process.env.AXIOS_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/eventcreate" element={<CreateEventPage />} />
        <Route path="/opinion" element={<FoodOpinionPage />} />
        <Route path="/reviews/:id" element={<ReviewPage />} />

        <Route path="/team/:id" element={<TeamListing />} />
        <Route path="/team/:id/chat" element={<GroupChat />} /> {/* Route for team listing */}
      </Routes>
    </Router>
  );
}

export default App;
