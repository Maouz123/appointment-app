// ----------------------Login------------
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync,faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = 'https://hiring-test-task.vercel.app/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });
      
      onLogin(response.data.token);
      console.log(response.data.token)
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4 text-green-500">CCRIPT</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          className="border-b border-green-500 shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="border-b border-green-500 shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="bg-green-500  rounded  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleLogin}
      >
        Sign In
      </button>
    </div>
  );
};
// ---------------appointment------------------
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
      <h1 className="text-3xl font-bold mb-10 text-green-500">CCRIPT
      <FontAwesomeIcon
            icon={faSignOutAlt}
            style={{ cursor: 'pointer', fontSize: '24px', marginLeft: '1250px', color: 'red' }}
          /></h1>
      <table className="table-auto border-collapse border-solid-1px border-round position-absolute border-black-500 w-full">
        <thead>
          <tr>
          <th className="border border-blue-500">
          <FontAwesomeIcon
          icon={faSync}
          onClick={handleRefreshToken}
          style={{ cursor: 'pointer', fontSize: '24px', color: 'green'}}
        />
    

</th>
            <th className="border border-black-500">Monday</th>
            <th className="border border-black-500">Tuesday</th>
            <th className="border border-black-500">Wednesday</th>
            <th className="border border-black-500">Thursday</th>
            <th className="border border-black-500">Friday</th>
            <th className="border border-black-500">Saturday</th>
            <th className="border border-black-500">Sunday</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: 8 }).map((_, colIndex) => (
                <td key={colIndex} className="border border-black-500">
                  {colIndex === 0 && rowIndex !== 0 ? (
                    <div className="flex flex-col items-center font-bold">
                      {/* <span>{`${7 + rowIndex} AM`}</span> */}
                      <span>{['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm'][rowIndex - 1]}</span>
                      
                    </div>
                  ) :
                   rowIndex === 0 && colIndex !== 0 ? (
                  
                    <span >{[][colIndex - 1]}</span>
                  ) : (
                    // Appointment details cell for the rest of the table
                    <div>
                      {/* Render appointment details based on the appointments data */}
                      {appointments.map((appointment) => (
                        // Check if the appointment matches the current cell
                        appointment.weekDay ===
                          ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][
                            colIndex - 1
                          ] &&
                        appointment.startTimeFormatted === `${8 + rowIndex} AM` ? (
                          <div key={appointment.id} className="bg-gray-200 p-2 rounded">
                            {/* <p>{`Start: ${appointment.startTimeFormatted}`}</p>
                            <p>{`End: ${appointment.endTimeFormatted}`}</p> */}
                            <p>{`${appointment.name}`}</p>
                          </div>
                        ) : null
                      ))}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
//---------app coding here--------

const App = () => {
  const [accessToken, setAccessToken] = useState('');

  const handleLogin = (token) => {
    setAccessToken(token);
  };

  return (
    <div>
      {!accessToken ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Appointments accessToken={accessToken} />
      )}
    </div>
  );
};

export default App;
