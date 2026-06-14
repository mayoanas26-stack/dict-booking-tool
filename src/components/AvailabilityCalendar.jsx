import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { fetchAvailability } from '../api/mockApi';

export default function AvailabilityCalendar() {
  const [location, setLocation] = useState('Iligan City');
  const [type, setType] = useState('room');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch mock events
    const loadEvents = async () => {
      const data = await fetchAvailability();
      // Simple filter based on location (in a real app, type would be filtered too)
      const filteredData = data.filter(e => e.extendedProps.location.includes(location));
      
      // Apply coloring based on status
      const coloredEvents = filteredData.map(e => ({
        ...e,
        display: 'block',
        textColor: '#ffffff',
        backgroundColor: e.extendedProps.status.toLowerCase() === 'pending' ? 'rgba(245, 158, 11, 0.85)' : 'rgba(0, 59, 140, 0.85)',
        borderColor: e.extendedProps.status.toLowerCase() === 'pending' ? 'rgba(245, 158, 11, 0.85)' : 'rgba(0, 59, 140, 0.85)'
      }));
      
      setEvents(coloredEvents);
    };
    loadEvents();
  }, [location, type]);

  const handleEventClick = (info) => {
    alert(`Event: ${info.event.title}\nStatus: ${info.event.extendedProps.status}`);
  };

  return (
    <section id="schedule" className="section-padding" style={{ background: 'var(--white)' }}>
      <div className="container">
        <div className="section-heading">
          <h2>Availability Calendar</h2>
          <div className="location-tabs" id="calendar-location-tabs">
            {['Iligan City', 'Maramag', 'Tubod'].map(loc => (
              <button 
                key={loc}
                className={`loc-tab ${location === loc ? 'active' : ''}`}
                onClick={() => setLocation(loc)}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
        
        <div className="calendar-wrapper" style={{ padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <div className="type-tabs" style={{ margin: 0 }}>
              <button className={`type-tab ${type === 'room' ? 'active' : ''}`} onClick={() => setType('room')}>Room</button>
              <button className={`type-tab ${type === 'starlink' ? 'active' : ''}`} onClick={() => setType('starlink')}>Starlink</button>
            </div>
            
            <div className="calendar-legend" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.85rem', fontWeight: 600, alignItems: 'center', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #d1d5db', background: 'var(--bg-light)', display: 'inline-block' }}></span> 
                    <span style={{ letterSpacing: '0.3px', textTransform: 'uppercase', fontSize: '0.75rem' }}>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.2)', display: 'inline-block' }}></span> 
                    <span style={{ letterSpacing: '0.3px', textTransform: 'uppercase', fontSize: '0.75rem' }}>Pending</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--dict-blue)', boxShadow: '0 0 0 3px rgba(0, 59, 140, 0.2)', display: 'inline-block' }}></span> 
                    <span style={{ letterSpacing: '0.3px', textTransform: 'uppercase', fontSize: '0.75rem' }}>Confirmed</span>
                </div>
            </div>
          </div>

          <div style={{ minHeight: '500px' }}>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={events}
              eventClick={handleEventClick}
              height="auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
