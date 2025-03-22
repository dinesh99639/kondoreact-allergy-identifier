import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

import UserContext from '../context/UserContext';
import { getUserDetails } from '../services/auth';

import Header from '../components/Header';
import ScannerDialog from '../components/ScannerDialog/ScannerDialog';

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
          <Header>
            <Outlet />

            <ScannerDialog />
          </Header>
        </>
      )}
    </>
  );
};

export default Home;
