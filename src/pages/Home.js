import React, { useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { Outlet, useNavigate } from 'react-router';
import Header from '../components/Header';
import { getUserDetails } from '../services/auth';

const Home = () => {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchUserDetails = async (access_token) => {
    const userDetails = await getUserDetails(access_token);
    if (userDetails.success) {
      setUserDetails(userDetails.data);
    }
  };

  useEffect(() => {
    if (document.cookie) {
      const access_token = document.cookie.split('=')[1];
      fetchUserDetails(access_token);
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <>
      {userDetails && (
        <>
          <Header />
          <div style={{ marginLeft: '30px' }}>
            <Outlet />
          </div>
        </>
      )}
    </>
  );
};

export default Home;
