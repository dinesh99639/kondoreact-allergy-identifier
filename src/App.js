import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import ExpiryProducts from './pages/ExpiryProducts';
import Groups from './pages/Groups';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Home />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="products-expiry" element={<ExpiryProducts />} />
            <Route path="groups" element={<Groups />} />

            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
