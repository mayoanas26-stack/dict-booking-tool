import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ManageBookings from './pages/ManageBookings';
import Admin from './pages/Admin';
import Attendance from './pages/Attendance';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manage" element={<ManageBookings />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </Router>
  );
}

export default App;
