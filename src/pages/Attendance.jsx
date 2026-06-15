import React, { useState, useEffect } from 'react';
import LoginCard from '../components/LoginCard';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const FloatingField = ({ label, placeholder, required = false, width = '100%', options = null }) => {
  const [value, setValue] = useState('');
  return (
    <div className="floating-group" style={{ gridColumn: width === '100%' ? '1 / -1' : `span ${width}` }}>
      {options ? (
        <React.Fragment>
          <select 
            className={`floating-input ${value ? 'has-value' : ''}`}
            value={value}
            onChange={e => setValue(e.target.value)}
          >
            <option value="" disabled hidden></option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <svg style={{position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'}} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </React.Fragment>
      ) : (
        <input 
          type="text" 
          className={`floating-input ${value ? 'has-value' : ''}`}
          placeholder={placeholder || ' '}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      )}
      <label className="floating-label">{label} {required && <span style={{color: 'red'}}>*</span>}</label>
    </div>
  );
};

export default function Attendance() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [portalLocation, setPortalLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState('All Rooms');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [dbRooms, setDbRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        handleAuthSession(session);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setPortalLocation('');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && portalLocation) {
      fetchEvents();
      fetchDbRooms();
    }
  }, [isAuthenticated, portalLocation]);

  const fetchDbRooms = async () => {
    const { data, error } = await supabase
      .from('featured_rooms')
      .select('title')
      .eq('location', portalLocation);
    
    if (!error && data) {
      setDbRooms(data.map(r => r.title));
    }
  };

  const handleAuthSession = async (session) => {
    if (session?.user) {
      const { data, error } = await supabase
        .from('user_roles')
        .select('location')
        .eq('user_id', session.user.id)
        .single();

      if (data && data.location) {
        setPortalLocation(data.location);
        setIsAuthenticated(true);
      } else {
        toast.error('Access Denied. You do not have an assigned location.');
        handleLogout();
      }
    }
  };

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    handleAuthSession(session);
  };

  const handleLogin = async (username, password) => {
    const email = username.includes('@') ? username : `${username}@iligan.com`;
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      toast.error('Invalid credentials: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('room_reservations')
      .select('*')
      .order('start_time', { ascending: false });

    if (!error && data) {
      const formatted = data
        .filter(d => portalLocation === 'Admin' || d.dtc_location.includes(portalLocation))
        .map(d => {
          const startDate = new Date(d.start_time);
          const endDate = new Date(d.end_time);
          return {
            id: d.id,
            title: d.event_name,
            start: startDate.toLocaleString(), // keep original for modal
            end: endDate.toLocaleString(),
            month: startDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
            day: startDate.getDate(),
            timeRange: `${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
            room: d.room_type
          };
        });
      setEvents(formatted);
    }
    setIsLoading(false);
  };

  const uniqueRooms = ['All Rooms', ...dbRooms];

  const filteredEvents = events.filter(e => 
    (e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.room.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (roomFilter === 'All Rooms' || e.room === roomFilter)
  );

  const paginationBtnStyle = {
    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px',
    color: 'var(--navy-dark)', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
    fontWeight: '600'
  };

  // FloatingField has been extracted to module scope
  if (!isAuthenticated) {
    return (
      <LoginCard 
        title="Attendance Portal" 
        buttonText="Enter Portal" 
        onLogin={handleLogin} 
      />
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <header className="navbar-app">
        <div className="nav-container" style={{ padding: '0 40px', maxWidth: 'none' }}>
          <Link to="/" className="logo">
            <img src="https://lh3.googleusercontent.com/d/1MdTXBsrssyssWya97x8O2uVR2e3JAGU9" alt="DICT Logo" style={{ width: '45px', height: 'auto' }} />
            <div className="logo-text-wrapper">
              <span className="logo-text-main" style={{ fontSize: '1.2rem' }}>DICT Region X</span>
              <span className="logo-text-sub">Attendance Portal</span>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontWeight: '700', color: 'var(--navy-dark)', fontSize: '1.05rem' }}><span style={{fontWeight: 400, color: 'var(--text-muted)'}}>Location:</span> {portalLocation}</span>
            <button 
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ padding: '8px 20px', fontSize: '0.9rem' }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '50px auto', padding: '0 20px' }}>
        
        <div style={{ display: 'flex', gap: '15px', maxWidth: '750px', margin: '0 auto 40px auto' }}>
          <div className="search-pill-wrapper" style={{ flex: 1, margin: 0, maxWidth: 'none' }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              className="search-pill"
              placeholder="Search events by name or room..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <select 
              value={roomFilter} 
              onChange={e => setRoomFilter(e.target.value)}
              style={{
                appearance: 'none',
                height: '100%',
                padding: '0 45px 0 24px',
                borderRadius: '50px',
                border: '1px solid #e2e8f0',
                background: 'white',
                color: 'var(--navy-dark)',
                fontSize: '0.95rem',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}
            >
              {uniqueRooms.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <svg style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontSize: '1.1rem' }}>Loading events from database...</div>
          ) : filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', fontSize: '1.1rem' }}>No events found for {portalLocation}.</div>
          ) : filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', color: 'var(--navy-dark)', fontSize: '1.2rem', fontWeight: '800' }}>{event.title}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <span style={{ fontWeight: '700', color: 'var(--navy-dark)' }}>Start:</span> {event.start}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--navy-dark)' }}>End:</span> {event.end}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span style={{ fontWeight: '700', color: 'var(--navy-dark)' }}>Room:</span> {event.room}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div style={{ marginLeft: '16px' }}>
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="btn btn-primary"
                  style={{ whiteSpace: 'nowrap', padding: '10px 24px', fontSize: '0.9rem', borderRadius: '30px' }}
                >
                  Log Attendance
                </button>
              </div>

            </div>
          ))}
        </div>

        {!isLoading && filteredEvents.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button style={{...paginationBtnStyle, opacity: 0.5}} disabled>&laquo;</button>
              <button style={{...paginationBtnStyle, opacity: 0.5}} disabled>&lsaquo;</button>
              <button style={{ ...paginationBtnStyle, background: 'var(--dict-blue)', color: 'white', borderColor: 'var(--dict-blue)' }}>1</button>
              <button style={paginationBtnStyle}>2</button>
              <button style={paginationBtnStyle}>3</button>
              <button style={paginationBtnStyle}>&rsaquo;</button>
              <button style={paginationBtnStyle}>&raquo;</button>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
              Showing 1-10 of 23 Events
            </div>
          </div>
        )}
      </main>

      {/* Attendance Modal */}
      {selectedEvent && (
        <div className="modal-backdrop">
          <div className="modal-content">
            
            <div className="modal-header-glass">
              <div>
                <h2 style={{ margin: '0 0 8px 0', color: 'var(--navy-dark)', fontSize: '1.8rem', fontWeight: '800' }}>{selectedEvent.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '0.95rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {selectedEvent.room}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {selectedEvent.start.split(',')[0]}
                  </span>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setSelectedEvent(null)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="form-grid">
              <FloatingField label="Date of Attendance" required={true} options={['Select Date', selectedEvent.start.split(',')[0]]} width="100%" />
              
              <FloatingField label="Full Name" placeholder="Juan Dela Cruz" width="1" />
              <FloatingField label="Email Address" placeholder="juan@example.com" width="1" />
              
              <FloatingField label="Contact Number" placeholder="0917..." width="1" />
              <FloatingField label="Province / HUC" placeholder="Lanao del Norte" width="1" />
              
              <FloatingField label="Designation / Role" placeholder="e.g. Director" width="1" />
              <FloatingField label="Office / Department" placeholder="e.g. IT" width="1" />
              
              <FloatingField label="Age" placeholder="" width="1" />
              <FloatingField label="Sex" options={['Select', 'Male', 'Female', 'Other']} width="1" />
              
              <FloatingField label="GAD Category" options={['None', 'Solo Parent', 'PWD', 'Senior Citizen', 'Indigenous People']} width="100%" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => { toast.success('Attendance logged successfully!'); setSelectedEvent(null); }}
              >
                Submit Attendance
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
