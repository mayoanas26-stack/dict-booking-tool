import React, { useState } from 'react';
import LoginCard from '../components/LoginCard';

export default function Attendance() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [portalLocation, setPortalLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleLogin = (username, password) => {
    const validUsers = {
      'admin.iligan': { pass: 'dtc.iligan', loc: 'Iligan City' },
      'admin.maramag': { pass: 'dtc.maramag', loc: 'Maramag' },
      'admin.tubod': { pass: 'dtc.tubod', loc: 'Tubod' }
    };

    if (validUsers[username] && validUsers[username].pass === password) {
      setPortalLocation(validUsers[username].loc);
      setIsAuthenticated(true);
    } else {
      alert('Invalid username or password. \nTry: admin.iligan / dtc.iligan');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPortalLocation('');
  };

  const mockEvents = [
    { id: 1, title: 'ICT Capacity Building', start: '6/4/2026, 12:00:00 AM', end: '6/5/2026, 12:00:00 AM', room: 'Conference Room' },
    { id: 2, title: 'Trying', start: '6/4/2026, 1:24:00 PM', end: '6/8/2026, 1:24:00 PM', room: 'Conference Room' },
    { id: 3, title: 'Dummy Event 1', start: '6/10/2026, 8:00:00 AM', end: '6/10/2026, 5:00:00 PM', room: 'Conference Room' },
    { id: 4, title: 'Dummy Event 2', start: '6/15/2026, 9:00:00 AM', end: '6/15/2026, 12:00:00 PM', room: 'Conference Room' },
    { id: 5, title: 'Dummy Event 3', start: '6/20/2026, 1:00:00 PM', end: '6/20/2026, 4:00:00 PM', room: 'Conference Room' },
    { id: 6, title: 'Dummy Event 4', start: '6/25/2026, 8:00:00 AM', end: '6/25/2026, 5:00:00 PM', room: 'Conference Room' },
  ];

  const filteredEvents = mockEvents.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginationBtnStyle = {
    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px',
    color: 'var(--navy-dark)', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
  };

  const FloatingField = ({ label, placeholder, required = false, width = '100%', options = null }) => (
    <div style={{ position: 'relative', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 16px', backgroundColor: 'white', flex: width === '100%' ? 'none' : width, width: width === '100%' ? '100%' : 'auto' }}>
      <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
        {label} {required && <span style={{color: 'red'}}>*</span>}
      </label>
      {options ? (
        <select style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', color: 'var(--navy-dark)', fontSize: '1rem', padding: '2px 0', fontFamily: 'inherit', appearance: 'none', fontWeight: 500 }}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type="text" placeholder={placeholder} style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', color: 'var(--navy-dark)', fontSize: '1rem', padding: '2px 0', fontFamily: 'inherit', fontWeight: 500 }} />
      )}
      {options && <svg style={{position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'}} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh' }}>
        <LoginCard 
          title="Portal Access" 
          buttonText="Enter Portal" 
          onLogin={handleLogin} 
        />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Custom Header */}
      <header style={{ background: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src="https://lh3.googleusercontent.com/d/1MdTXBsrssyssWya97x8O2uVR2e3JAGU9" 
            alt="DICT Logo" 
            style={{ width: '45px', height: 'auto' }} 
          />
          <div className="dict-text-wrapper">
            <div className="dict-text-top">REPUBLIC OF THE PHILIPPINES</div>
            <div className="dict-text-bottom">DEPARTMENT OF INFORMATION AND<br/>COMMUNICATIONS TECHNOLOGY</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontWeight: '700', color: 'var(--navy-dark)', fontSize: '1rem' }}>{portalLocation}</span>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'white', 
              border: '1px solid #cbd5e1', 
              color: 'var(--navy-dark)', 
              fontWeight: '700', 
              padding: '8px 20px', 
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--dict-blue)'; e.currentTarget.style.color = 'var(--dict-blue)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = 'var(--navy-dark)'; }}
          >
            Change Location
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search events by name or room..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '20px 20px 20px 55px',
              borderRadius: '40px',
              border: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              fontSize: '1rem',
              outline: 'none',
              color: 'var(--navy-dark)'
            }}
          />
        </div>

        {/* Event List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredEvents.map(event => (
            <div key={event.id} style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '25px 30px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
              border: '1px solid rgba(0,0,0,0.03)'
            }}>
              <div>
                <h3 style={{ margin: '0 0 12px 0', color: 'var(--navy-dark)', fontSize: '1.25rem', fontWeight: '800' }}>{event.title}</h3>
                <div style={{ display: 'flex', gap: '25px', color: '#64748b', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span style={{ fontWeight: '600' }}>Start:</span> {event.start} &nbsp;&nbsp; <span style={{ fontWeight: '600' }}>End:</span> {event.end}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--dict-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span style={{ fontWeight: '600' }}>Room:</span> {event.room}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(event)}
                style={{
                  background: 'var(--ceb-navy)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0, 39, 94, 0.2)',
                  transition: 'transform 0.2s',
                  whiteSpace: 'nowrap',
                  marginLeft: '20px'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Log Attendance
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button style={paginationBtnStyle} disabled>&laquo;</button>
            <button style={paginationBtnStyle} disabled>&lsaquo;</button>
            <button style={{ ...paginationBtnStyle, background: 'var(--ceb-navy)', color: 'white', borderColor: 'var(--ceb-navy)' }}>1</button>
            <button style={paginationBtnStyle}>2</button>
            <button style={paginationBtnStyle}>3</button>
            <button style={paginationBtnStyle}>&rsaquo;</button>
            <button style={paginationBtnStyle}>&raquo;</button>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            1-10 of 23
          </div>
        </div>
      </main>

      {/* Attendance Modal */}
      {selectedEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ margin: '0 0 10px 0', color: 'var(--navy-dark)', fontSize: '1.8rem', fontWeight: '800' }}>{selectedEvent.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.95rem', marginBottom: '6px' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Room: {selectedEvent.room}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.95rem' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Start: {selectedEvent.start} | End: {selectedEvent.end}
              </div>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <FloatingField label="Date of Attendance" required={true} options={['No valid dates available for today', selectedEvent.start.split(',')[0]]} />
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <FloatingField label="Full Name" placeholder="Juan Dela Cruz" width="1" />
                <FloatingField label="Email Address" placeholder="juan@example.com" width="1" />
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <FloatingField label="Contact" placeholder="0917..." width="1" />
                <FloatingField label="Province / HUC" placeholder="Lanao del Norte" width="1" />
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <FloatingField label="Designation / Role" placeholder="e.g. Director" width="1" />
                <FloatingField label="Office / Department" placeholder="e.g. IT" width="1" />
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <FloatingField label="Age" placeholder="" width="100px" />
                <FloatingField label="Sex" options={['Select', 'Male', 'Female', 'Other']} width="1" />
                <FloatingField label="GAD Category" options={['None', 'Solo Parent', 'PWD', 'Senior Citizen', 'Indigenous People']} width="1.5" />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '35px' }}>
              <button 
                onClick={() => setSelectedEvent(null)}
                style={{ background: 'white', border: '1px solid #cbd5e1', color: 'var(--navy-dark)', fontWeight: '700', padding: '12px 30px', borderRadius: '30px', cursor: 'pointer', fontSize: '1.05rem', minWidth: '140px' }}
              >
                Cancel
              </button>
              <button 
                style={{ background: 'var(--ceb-navy)', border: 'none', color: 'white', fontWeight: '700', padding: '12px 30px', borderRadius: '30px', cursor: 'pointer', fontSize: '1.05rem', boxShadow: '0 4px 10px rgba(0, 39, 94, 0.2)' }}
                onClick={() => { alert('Attendance logged!'); setSelectedEvent(null); }}
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
