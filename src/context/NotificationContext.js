import { createContext, useState } from 'react';
import { Fade } from '@progress/kendo-react-animation';
import {
  Notification,
  NotificationGroup,
} from '@progress/kendo-react-notification';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: '',
    timeOut: 6000,
  });

  const showNotification = (obj) => {
    setNotification({ ...obj, isOpen: true });
    setTimeout(() => {
      setNotification({ isOpen: false, type: '', message: '', timeOut: 6000 });
    }, obj.timeOut || 6000);
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
      }}
    >
      {children}
      <NotificationGroup style={{ right: 10, bottom: 10,zIndex:'100003' }}>
        <Fade>
          {notification.isOpen && (
            <Notification
              type={{ style: notification.type, icon: true }}
              closable={true}
              onClose={prev => {setNotification({...prev, isOpen: false})}}
            >
              <span>{notification.message}</span>
            </Notification>
          )}
        </Fade>
      </NotificationGroup>
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
