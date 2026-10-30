import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ReviewPage = () => {
  const location = useLocation();
  const { item } = location.state; // Retrieve the item passed from FoodOpinionPage
  const [reviews, setReviews] = useState([]);

  // Fetch reviews based on the selected item when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/reviews/${item.name}`); // Update the URL as needed
        console.log(response.data); // Log the response data for debugging
        setReviews(response.data.reviews); // Set the reviews array from the response
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [item.name]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-600">Reviews for {item.name}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={review._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0">
                  {/* Icon placeholder: You can replace this with actual icons for departments */}
                  <div className="w-12 h-12 bg-blue-500 rounded-full text-white flex items-center justify-center text-lg font-bold">
                    {review.reviewerName[0].toUpperCase()}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 capitalize">{review.reviewerName}</h2>
                </div>
              </div>
              <p className="text-gray-600">Rating: {review.rating}</p>
              <p className="text-gray-600">{review.comment}</p>
              <p className="text-gray-400 text-sm">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews found for this item.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
