// Appointments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://hiring-test-task.vercel.app/api';

const Appointments = ({ accessToken }) => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Convert the data property to an array
      const appointmentsArray = Object.values(response.data);

      setAppointments(appointmentsArray);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    }
  };

  useEffect(() => {
    // Fetch table data when the component mounts or when the access token changes
    getAppointments();
  }, [accessToken]);

  const handleRefreshToken = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/refresh-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Refresh Token Success:', response.data);

      // After refreshing the token, fetch the updated appointments
      getAppointments();
    } catch (error) {
      console.error('Failed to refresh token', error);

      if (error.response) {
        console.log('Server Response:', error.response.data);
        console.log('Status Code:', error.response.status);
      }

      if (error.response && error.response.status === 401) {
        console.log('Unauthorized access. Redirect to login page.');
      }
    }
  };

  return (
    <div className="container mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-4">CCRIPT</h1>
      <table className="table-auto border-collapse border border-blue-500 w-full">
        {/* ... (rest of the code) */}
      </table>
    </div>
  );
};

export default Appointments;
