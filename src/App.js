import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import Login from './pages/Auth/Login';
import { BrowserRouter, Routes, Route } from 'react-router';
import Register from './pages/Auth/Register';
import Header from './components/Header';
import Home from './pages/Home';
import NotificationContext from './context/NotificationContext';
import { Fade } from '@progress/kendo-react-animation';
import {
  Notification,
  NotificationGroup,
} from '@progress/kendo-react-notification';

function App() {
  const [hasToken, setHasToken] = useState(false);
  const {
    failureMessage,
    failure,
    successMessage,
    success,
    setFailure,
    setSuccess,
  } = useContext(NotificationContext);
  return (
    <div style={{ height: '100vh' }}>
      {hasToken && <Header />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
      <NotificationGroup style={{ right: 0, bottom: 0 }}>
        <Fade>
          {failure && (
            <Notification
              style={{}}
              type={{ style: 'error', icon: true }}
              closable={true}
              onClose={() => setFailure(false)}
            >
              <span>{failureMessage}</span>
            </Notification>
          )}
        </Fade>
        <Fade>
          {success && (
            <Notification
              style={{}}
              type={{ style: 'error', icon: true }}
              closable={true}
              onClose={() => setSuccess(false)}
            >
              <span>{successMessage}</span>
            </Notification>
          )}
        </Fade>
      </NotificationGroup>
    </div>
  );
}

export default App;
