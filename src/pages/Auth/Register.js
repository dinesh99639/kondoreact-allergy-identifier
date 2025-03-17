import { TextBox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import React, { useContext, useState } from 'react';
import { Card } from '@progress/kendo-react-layout';
import { Link, useNavigate } from 'react-router';
import { MdEmail } from 'react-icons/md';
import { MdOutlinePassword } from 'react-icons/md';
import { BiSolidHide } from 'react-icons/bi';
import { BiSolidShow } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { Error } from '@progress/kendo-react-labels';
import { getToken, registerNewUser } from '../../services/auth';
import NotificationContext from '../../context/NotificationContext';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { setSuccess, setF } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setIsRegistering(true);
    const { access_token, token_type, success } = await getToken();
    if (success) {
      const userDetails = await registerNewUser(
        email,
        firstName,
        lastName,
        password,
        access_token,
        token_type
      );

      if (userDetails.success) {
        navigate('/login');
      } else {
        setRegistrationFailureNotifcation(true);
        setRegistrationFailureMessage(userDetails.error);
        setIsRegistering(false);
        return;
      }
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
          width: 500,
          padding: '2rem',
          display: 'flex',
          boxShadow:
            'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
        }}
      >
        <h2 style={{ textAlign: 'center', margin: '1rem' }}>
          Sign up with email
        </h2>
        <div
          style={{
            display: 'flex',
            gap: '0.1rem',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ position: 'relative' }}>
            <FaUserCircle
              style={{
                position: 'absolute',
                zIndex: 1,
                top: 8,
                left: 5,
              }}
            />
            <TextBox
              placeholder="First Name"
              value={firstName}
              onChange={(e) => {
                const regex = /^[a-zA-Z]+$/;
                if (e.target.value.length === 0) {
                  setFirstNameError('First Name is required');
                } else if (!regex.test(e.target.value)) {
                  setFirstNameError('Should contain only alphabets');
                } else {
                  setFirstNameError('');
                }
                setFirstName(e.target.value);
              }}
              style={{ paddingLeft: 15, width: '100%' }}
            ></TextBox>
            <Error style={{ minHeight: '18px', margin: '5px' }}>
              {firstNameError}
            </Error>
          </div>
          <div style={{ position: 'relative' }}>
            <FaUserCircle
              style={{
                position: 'absolute',
                zIndex: 1,
                top: 8,
                left: 5,
              }}
            />
            <TextBox
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                const regex = /^[a-zA-Z]+$/;
                if (e.target.value.length === 0) {
                  setLastNameError('Last Name is required');
                } else if (!regex.test(e.target.value)) {
                  setLastNameError('Should contain only alphabets');
                } else {
                  setLastNameError('');
                }
                setLastName(e.target.value);
              }}
              style={{ paddingLeft: 15 }}
            />
            <Error style={{ minHeight: '18px', margin: '5px' }}>
              {lastNameError}
            </Error>
          </div>
        </div>
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
          onClick={handleRegister}
          disabled={
            isRegistering ||
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            firstNameError ||
            lastNameError ||
            emailError ||
            passwordError
          }
        >
          {!isRegistering ? (
            'Register'
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CgSpinner className="spinner" />
              &nbsp;Registering
            </div>
          )}
        </Button>
        <Link className="link" to="/login">
          Login Here
        </Link>
      </Card>
    </div>
  );
};

export default Register;
