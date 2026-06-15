import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ManageBookings from './pages/ManageBookings';
import Admin from './pages/Admin';
import Attendance from './pages/Attendance';
import ContactUs from './pages/ContactUs';
import './index.css';
import './admin-ui.css';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--navy-dark)',
            color: '#fff',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            padding: '16px 24px',
            fontSize: '15px',
            fontWeight: '600'
          },
          success: {
            iconTheme: { primary: '#2ecc71', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          }
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manage" element={<ManageBookings />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App;
