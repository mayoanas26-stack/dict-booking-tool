import React, { useState } from 'react';
import RoomBooking from './RoomBooking';
import StarlinkBooking from './StarlinkBooking';

export default function BookingWidget() {
  const [activeTab, setActiveTab] = useState('room');

  return (
    <div className="booking-widget">
      <div className="widget-tabs">
        <button 
          className={`tab-btn ${activeTab === 'room' ? 'active' : ''}`} 
          onClick={() => setActiveTab('room')}
        >
          <span className="tab-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18"></path>
              <path d="M9 8h1"></path>
              <path d="M9 12h1"></path>
              <path d="M14 8h1"></path>
              <path d="M14 12h1"></path>
              <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
            </svg>
          </span> 
          Book a Room
        </button>
        <button 
          className={`tab-btn ${activeTab === 'starlink' ? 'active' : ''}`} 
          onClick={() => setActiveTab('starlink')}
        >
          <span className="tab-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
              <line x1="12" y1="20" x2="12.01" y2="20"></line>
            </svg>
          </span> 
          Book Starlink
        </button>
      </div>
      <div className="tab-content-container">
        {activeTab === 'room' && (
          <div className="tab-content active">
            <RoomBooking />
          </div>
        )}
        {activeTab === 'starlink' && (
          <div className="tab-content active">
            <StarlinkBooking />
          </div>
        )}
      </div>
    </div>
  );
}
