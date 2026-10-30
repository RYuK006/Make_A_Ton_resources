import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodOpinionPage = () => {
  const navigate = useNavigate();
  const [opinions, setOpinions] = useState([]);
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Food', 'Decoration'];

  // Fetch opinions from the API when the component mounts
  useEffect(() => {
    const fetchOpinions = async () => {
      try {
        const response = await axios.get('/api/opinions'); // Update the URL as needed
        setOpinions(response.data);
      } catch (error) {
        console.error('Error fetching opinions:', error);
      }
    };

    fetchOpinions();
  }, []);

  // Filter opinions based on selected category
  const filteredOpinions = filter === 'All' ? opinions : opinions.filter(item => item.category === filter);

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Navigate to the review page
  const handleReviewClick = (item) => {
    navigate(`/reviews/${item.name}`, { state: { item } });
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Food and Decoration Opinions</h1>

      {/* Filter Dropdown */}
      <div className="mb-6">
        <label htmlFor="filter" className="mr-4 text-lg">Filter by:</label>
        <select
          id="filter"
          className="p-2 border border-gray-300 rounded"
          value={filter}
          onChange={handleFilterChange}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* List of Opinions */}
      <ul>
        {filteredOpinions.length > 0 ? (
          filteredOpinions.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b py-3"
            >
              <span>{item.name}</span>
              <span>Contact: {item.contact}</span>
              <button
                className="ml-2 text-blue-500 hover:underline"
                onClick={() => handleReviewClick(item)}
              >
                View Reviews
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No opinions found for this category.</li>
        )}
      </ul>
    </div>
  );
};

export default FoodOpinionPage;
