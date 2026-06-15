import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { fetchAvailability } from '../api/apiService';
import toast from 'react-hot-toast';

export default function AvailabilityCalendar() {
  const [location, setLocation] = useState('Iligan City');
  const [type, setType] = useState('room');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Fetch mock events
    const loadEvents = async () => {
      const data = await fetchAvailability(type);
      
      const filteredData = data.filter(e => 
        e.extendedProps.location.includes(location) && 
        e.extendedProps.status !== 'Cancelled'
      );
      
      const coloredEvents = filteredData.map(e => ({
        ...e,
        display: 'block',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: '#ffffff'
      }));
      
      setEvents(coloredEvents);
    };
    loadEvents();
  }, [location, type]);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  const renderEventContent = (eventInfo) => {
    const isPending = eventInfo.event.extendedProps.status?.toLowerCase() === 'pending';
    const bgGradient = isPending ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, var(--dict-blue) 0%, #00296b 100%)';

    return (
      <div 
        className="premium-calendar-event"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          borderRadius: '6px',
          background: bgGradient,
          color: '#ffffff',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.15)',
          cursor: 'pointer'
        }}
      >
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          flexShrink: 0,
          boxShadow: '0 0 4px rgba(255,255,255,0.8)'
        }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.3px', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {eventInfo.timeText && <span style={{ opacity: 0.85, marginRight: '6px', fontWeight: 500 }}>{eventInfo.timeText}</span>}
            {eventInfo.event.title}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section id="schedule" className="section-padding" style={{ background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        .premium-calendar-event {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .premium-calendar-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
        }
        .fc-event {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .fc-daygrid-event-harness {
          margin-bottom: 4px;
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div className="container">
        <div className="section-heading">
          <h2>Availability Calendar</h2>
          <div className="frc-tabs" id="calendar-location-tabs" style={{ marginBottom: 0 }}>
            {['Iligan City', 'Maramag', 'Tubod'].map(loc => (
              <button 
                key={loc}
                className={`frc-tab ${location === loc ? 'active' : ''}`}
                onClick={() => setLocation(loc)}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
        
        <div className="premium-calendar-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <div className="segmented-control">
              <button className={`segment-btn ${type === 'room' ? 'active' : ''}`} onClick={() => setType('room')}>Room</button>
              <button className={`segment-btn ${type === 'starlink' ? 'active' : ''}`} onClick={() => setType('starlink')}>Starlink</button>
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
              eventContent={renderEventContent}
              eventClick={handleEventClick}
              height="auto"
            />
          </div>
        </div>
      </div>

      {/* Event Details Premium Modal */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setSelectedEvent(null)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '450px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }} onClick={e => e.stopPropagation()}>
             {/* Header */}
             <div style={{ padding: '24px', background: 'linear-gradient(135deg, var(--dict-blue), #00296b)', color: 'white', position: 'relative' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 600, paddingRight: '30px' }}>{selectedEvent.title}</h3>
                <button onClick={() => setSelectedEvent(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
             </div>
             {/* Body */}
             <div style={{ padding: '32px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   {/* Date & Time */}
                   <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dict-blue)' }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Date & Time</div>
                        <div style={{ fontWeight: 600, color: 'var(--navy-dark)', fontSize: '1rem', lineHeight: 1.4 }}>
                          {selectedEvent.start.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} 
                          {selectedEvent.end ? ' — ' + selectedEvent.end.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                   </div>
                   {/* Location */}
                   <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dict-blue)' }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>DTC Office</div>
                        <div style={{ fontWeight: 600, color: 'var(--navy-dark)', fontSize: '1rem' }}>{selectedEvent.extendedProps.location}</div>
                      </div>
                   </div>
                   {/* Type */}
                   <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dict-blue)' }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Resource Type</div>
                        <div style={{ fontWeight: 600, color: 'var(--navy-dark)', fontSize: '1rem' }}>{selectedEvent.extendedProps.type}</div>
                      </div>
                   </div>
                   {/* Status */}
                   <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dict-blue)' }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Status</div>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '50px', 
                          fontSize: '0.85rem', 
                          fontWeight: 'bold',
                          backgroundColor: selectedEvent.extendedProps.status.toLowerCase() === 'pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(46, 204, 113, 0.15)',
                          color: selectedEvent.extendedProps.status.toLowerCase() === 'pending' ? '#d97706' : '#27ae60'
                        }}>
                          {selectedEvent.extendedProps.status}
                        </span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </section>
  );
}
