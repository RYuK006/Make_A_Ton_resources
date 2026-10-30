import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';  

export const fetchCampaignData = async (formData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/generate-campaign-post/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data to backend
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json(); // Parse the response as JSON
      return data; // Return the campaign data
    } catch (error) {
      console.error('Failed to fetch campaign data:', error);
      throw error;
    }
  };

  export const fetchNotificationData = async (formData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/generate-Push-Notification/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data to backend
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json(); // Parse the response as JSON
      return data; // Return the campaign data
    } catch (error) {
      console.error('Failed to fetch campaign data:', error);
      throw error;
    }
  };




  export const submitUpdatedCampaign = async (data: any) => {
    try {
      console.log(data)
      const response = await fetch(`${BASE_URL}/submit-updated-campaign/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Ensure you're sending JSON
        },
        body: JSON.stringify(data),  // Convert your data to a JSON string
      });
  
      if (!response.ok) {
        throw new Error(`Error submitting campaign: ${response.statusText}`);
      }
  
      const result = await response.json();  // Parse the response as JSON
      return result;
    } catch (error) {
      console.error('Error submitting updated campaign:', error);
      throw error;
    }
  };
  

  export async function fetchCardData() {
    try {
      const response = await fetch(`${BASE_URL}/get-image/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch card data: ${response.status}`);
      }
  
      const data = await response.json();
      return data; // Assuming the response is JSON formatted
    } catch (error) {
      console.error('Error fetching card data:', error);
      throw error; // Re-throw error to handle it in the calling component
    }
  }

  export const submitNotification = async (data: any) => {
    try {
      console.log(data)
      const response = await fetch(`${BASE_URL}/send-notification/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Ensure you're sending JSON
        },
        body: JSON.stringify(data),  // Convert your data to a JSON string
      });
  
      if (!response.ok) {
        throw new Error(`Error submitting campaign: ${response.statusText}`);
      }
  
      const result = await response.json();  // Parse the response as JSON
      return result;
    } catch (error) {
      console.error('Error submitting updated campaign:', error);
      throw error;
    }
  };
  

  export async function fetchNotification() {
    try {
      const response = await fetch(`${BASE_URL}/fetch-notifications/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch card data: ${response.status}`);
      }
  
      const data = await response.json();
      return data; // Assuming the response is JSON formatted
    } catch (error) {
      console.error('Error fetching card data:', error);
      throw error; // Re-throw error to handle it in the calling component
    }
  }