import React, { useContext } from 'react';
import './App.css';
import Login from './pages/Auth/Login';
import { BrowserRouter, Routes, Route } from 'react-router';
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
          <Route path="/" element={<Home />}>
            <Route index element={<Dashboard />} />
            <Route path="products-expiry" element={<ExpiryProducts />} />
            <Route path="groups" element={<Groups />} />
          </Route>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
