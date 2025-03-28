import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { getUserDetails, login } from '../../services/auth';
import NotificationContext from '../../context/NotificationContext';
import UserContext from '../../context/UserContext';

import { TextBox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Card } from '@progress/kendo-react-layout';
import { Error } from '@progress/kendo-react-labels';

import { MdEmail } from 'react-icons/md';
import { MdOutlinePassword } from 'react-icons/md';
import { BiSolidHide } from 'react-icons/bi';
import { BiSolidShow } from 'react-icons/bi';
import { CgSpinner } from 'react-icons/cg';

import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setIsLoggingIn] = useState(false);
  const { showNotification } = useContext(NotificationContext);
  const { setUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoggingIn(true);
    const data = await login(email, password);
    if (data.success) {
      const userDetails = await getUserDetails(data.access_token);
      if (userDetails.success) {
        setUserDetails(userDetails.data);
      }
      document.cookie = `access_token=${data.access_token}`;
      setIsLoggingIn(false);
      navigate('/');
    } else {
      showNotification({ type: 'error', message: data.error });
      setIsLoggingIn(false);
    }
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card
        style={{
          padding: '2rem',
          display: 'flex',
          boxShadow:
            'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
        }}
        className="auth-card"
      >
        <h2 style={{ textAlign: 'center', margin: '1rem' }}>
          Sign in with email
        </h2>
        <div style={{ position: 'relative' }}>
          <MdEmail
            style={{
              position: 'absolute',
              zIndex: 1,
              top: 8,
              left: 5,
            }}
          />
          <TextBox
            placeholder="Email"
            value={email}
            onChange={(e) => {
              const emailRegex =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
              if (e.target.value.length === 0) {
                setEmailError('Email is required');
              } else if (!emailRegex.test(e.target.value)) {
                setEmailError('Enter a valid email address');
              } else {
                setEmailError('');
              }
              setEmail(e.target.value);
            }}
            style={{ paddingLeft: 15 }}
          />
          <Error style={{ minHeight: '18px', margin: '5px' }}>
            {emailError}
          </Error>
        </div>
        <div style={{ position: 'relative' }}>
          <MdOutlinePassword
            style={{
              position: 'absolute',
              zIndex: 1,
              top: 8,
              left: 5,
            }}
          />
          <TextBox
            placeholder="Password"
            value={password}
            onChange={(e) => {
              const passwordRegex = /^.{8,}$/;
              if (e.target.value.length === 0) {
                setPasswordError('Password is required');
              } else if (!passwordRegex.test(e.target.value)) {
                setPasswordError(
                  'Password should contain atleast 8 characters'
                );
              } else {
                setPasswordError('');
              }
              setPassword(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter' && !!email) {
                handleLogin();
              }
            }}
            type={showPassword ? 'text' : 'password'}
            style={{ paddingLeft: 15 }}
          />
          <Error style={{ minHeight: '18px', margin: '5px' }}>
            {passwordError}
          </Error>
          {!showPassword && (
            <BiSolidHide
              style={{
                position: 'absolute',
                zIndex: 1,
                top: 8,
                right: 5,
                cursor: 'pointer',
              }}
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
          {showPassword && (
            <BiSolidShow
              style={{
                position: 'absolute',
                zIndex: 1,
                top: 8,
                right: 5,
                cursor: 'pointer',
              }}
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>
        <Button
          themeColor={'primary'}
          onClick={handleLogin}
          disabled={
            loggingIn || !email || !password || passwordError || emailError
          }
        >
          {!loggingIn ? (
            'Sign In'
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CgSpinner className="spinner" />
              &nbsp;Signing In
            </div>
          )}
        </Button>
        <Link className="link" to="/register">
          Register Here
        </Link>
      </Card>
    </div>
  );
};

export default Login;
