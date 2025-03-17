import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@progress/kendo-theme-default/dist/all.css';
import { NotificationProvider } from './context/NotificationContext';
import { UserProvider } from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </UserProvider>
);
