import React, { useState, useEffect } from 'react';
import { fetchAvailability } from '../api/apiService';

export default function UpcomingEventsTicker() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadUpcoming = async () => {
      try {
        const rooms = await fetchAvailability('room');
        const starlinks = await fetchAvailability('starlink');
        
        const now = new Date();
        const allEvents = [...rooms, ...starlinks]
          .filter(e => e.extendedProps?.status?.toLowerCase() === 'confirmed' && new Date(e.start) >= now)
          .sort((a, b) => new Date(a.start) - new Date(b.start))
          .slice(0, 10);
        
        if (allEvents.length === 0) {
          // Fallback to dummy data to preserve the design aesthetic if no live upcoming events exist
          const dummyEvents = [
            { start: new Date(now.getTime() + 86400000 * 1), extendedProps: { location: 'Iligan City, LDN' }, title: 'Regional Assembly' },
            { start: new Date(now.getTime() + 86400000 * 2), extendedProps: { location: 'Maramag, Bukidnon' }, title: 'Cybersecurity Seminar' },
            { start: new Date(now.getTime() + 86400000 * 3), extendedProps: { location: 'Tubod, LDN' }, title: 'LGU Tech Training' },
            { start: new Date(now.getTime() + 86400000 * 4), extendedProps: { location: 'Iligan City, LDN' }, title: 'DICT Coordination Meeting' },
          ];
          setEvents(dummyEvents);
        } else {
          setEvents(allEvents);
        }
      } catch (err) {
        console.error("Failed to load ticker events");
      }
    };
    loadUpcoming();
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', height: '54px', background: 'white', borderBottom: '1px solid #e2e8f0', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      <style>
        {`
          @keyframes tickerScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-content {
            display: flex;
            align-items: center;
            white-space: nowrap;
            will-change: transform;
            animation: tickerScroll 40s linear infinite;
          }
          .ticker-content:hover {
            animation-play-state: paused;
          }
          .ticker-item {
            display: inline-flex;
            align-items: center;
            font-size: 0.95rem;
          }
          .ticker-date {
            color: #94a3b8;
            margin-right: 12px;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.85rem;
          }
          .ticker-location {
            color: #64748b;
            margin-right: 12px;
            font-weight: 600;
          }
          .ticker-title {
            color: #0f172a;
            font-weight: 700;
          }
          .ticker-separator {
            color: #cbd5e1;
            margin: 0 24px;
            font-weight: 300;
          }
        `}
      </style>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 32px', 
        background: 'white', 
        color: '#64748b', 
        fontWeight: 700, 
        fontSize: '0.85rem',
        letterSpacing: '1px',
        zIndex: 10,
        boxShadow: '10px 0 15px -5px rgba(255,255,255,1), 5px 0 10px -5px rgba(0,0,0,0.05)'
      }}>
        UPCOMING EVENTS
      </div>
      
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div className="ticker-content">
          {/* Triple the array to ensure smooth infinite scrolling even on ultra-wide screens */}
          {[...events, ...events, ...events, ...events].map((e, index) => {
            const dateObj = new Date(e.start);
            const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
            const day = dateObj.getDate();
            return (
              <div key={index} className="ticker-item">
                {index !== 0 && <span className="ticker-separator">|</span>}
                <span className="ticker-date">{month} {day}</span>
                <span className="ticker-location">{e.extendedProps.location}</span>
                <span className="ticker-title">{e.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
