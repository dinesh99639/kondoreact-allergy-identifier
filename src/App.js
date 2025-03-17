import React, { useContext } from 'react';
import './App.css';
import Login from './pages/Auth/Login';
import { BrowserRouter, Routes, Route } from 'react-router';
import Register from './pages/Auth/Register';
import Home from './pages/Home';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
