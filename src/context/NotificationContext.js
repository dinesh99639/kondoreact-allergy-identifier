import { createContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [failureMessage, setFailureMessage] = useState('');
  const [failure, setFailure] = useState(false);

  return (
    <NotificationContext.Provider
      value={{
        success,
        setSuccess,
        successMessage,
        setSuccessMessage,
        failure,
        setFailure,
        failureMessage,
        setFailureMessage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
