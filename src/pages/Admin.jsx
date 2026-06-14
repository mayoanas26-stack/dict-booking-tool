import React, { useState } from 'react';
import LoginCard from '../components/LoginCard';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminLocation, setAdminLocation] = useState('');
  const [loggedUsername, setLoggedUsername] = useState('');
  const [activeTab, setActiveTab] = useState('Room Reservations');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = (username, password) => {
    const validUsers = {
      'admin.iligan': { pass: 'dtc.iligan', loc: 'Iligan City' },
      'admin.maramag': { pass: 'dtc.maramag', loc: 'Maramag' },
      'admin.tubod': { pass: 'dtc.tubod', loc: 'Tubod' }
    };

    if (validUsers[username] && validUsers[username].pass === password) {
      setAdminLocation(validUsers[username].loc);
      setLoggedUsername(username);
      setIsAuthenticated(true);
    } else {
      alert('Invalid username or password. \nTry: admin.iligan / dtc.iligan');
    }
  };

  const mockBookings = [
    { id: 'RB-20260602-1853', timestamp: '6/2/2026, 10:34:16 AM', loc1: 'Iligan', loc2: 'City, LDN', event1: 'ICT', event2: 'Capacity Building', name1: 'Anas', name2: 'Mayo', email: 'mayoanas26@gmail.com' },
    { id: 'RB-20260602-2543', timestamp: '6/2/2026, 1:24:49 PM', loc1: 'Iligan', loc2: 'City, LDN', event1: 'Trying', event2: '', name1: 'Anas', name2: 'Mayo', email: 'mayoanas26@gmail.com' },
    { id: 'RB-20260604-0001', timestamp: '6/4/2026, 11:40:03 AM', loc1: 'Iligan', loc2: 'City, LDN', event1: 'Dummy', event2: 'Event 1', name1: 'John', name2: 'Doe', email: 'john.doe@example.com' },
    { id: 'RB-20260604-0002', timestamp: '6/4/2026, 11:40:03 AM', loc1: 'Iligan', loc2: 'City, LDN', event1: 'Dummy', event2: 'Event 2', name1: 'Jane', name2: 'Smith', email: 'jane.smith@example.com' }
  ];

  const mockStarlinkBookings = [
    { id: 'SB-20260610-6999', timestamp: '6/10/2026, 10:05:59 AM', loc1: 'Iligan', loc2: 'City, LDN', event1: 'Trying', event2: '', name1: 'Anas', name2: 'Mayo', email: 'mayoanas26@gmail.com' }
  ];

  const mockFeaturedRooms = [
    { id: '1', image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=60&h=40&q=80', title: 'Conference Room', loc: 'Iligan City', badge: 'Available', badgeBg: 'transparent', badgeColor: '#475569', pax: 20, chairs: 20, tables: 5, pcs: 1 },
    { id: '2', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=60&h=40&q=80', title: 'Collaboration Room I', loc: 'Iligan City', badge: 'Limited', badgeBg: '#ef4444', badgeColor: 'white', pax: 10, chairs: 10, tables: 3, pcs: 2 },
    { id: '3', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&w=60&h=40&q=80', title: 'Collaboration Room II', loc: 'Iligan City', badge: 'Available', badgeBg: 'transparent', badgeColor: '#475569', pax: 10, chairs: 10, tables: 3, pcs: 2 },
    { id: '4', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=60&h=40&q=80', title: 'Training Center', loc: 'Iligan City', badge: 'Available', badgeBg: 'transparent', badgeColor: '#475569', pax: 50, chairs: 50, tables: 10, pcs: 1 }
  ];

  const mockHighlights = [
    { id: '1', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=60&h=40&q=80', month: 'OCT', day: '21', title: 'A Glimpse into the DICT Year-End Party 2024!', link: '#' },
    { id: '2', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=60&h=40&q=80', month: 'NOV', day: '15', title: 'Tech Innovation Summit 2024 Highlights', link: '#' },
    { id: '3', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=60&h=40&q=80', month: 'DEC', day: '5', title: 'Community Engagement Program Review', link: '#' },
    { id: '4', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=60&h=40&q=80', month: 'SEP', day: '21', title: 'Testing', link: '#' }
  ];

  const currentBookings = activeTab === 'Starlink Installations' ? mockStarlinkBookings : activeTab === 'Room Reservations' ? mockBookings : activeTab === 'Featured Rooms' ? mockFeaturedRooms : activeTab === 'Highlights' ? mockHighlights : [];

  const FloatingField = ({ label, placeholder, type = "text", width = '100%', options = null, disabled = false }) => (
    <div style={{ position: 'relative', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 16px', backgroundColor: 'white', flex: width === '100%' ? 'none' : width, width: width === '100%' ? '100%' : 'auto' }}>
      <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: type === 'file' ? '8px' : '2px' }}>{label}</label>
      {type === 'textarea' ? (
        <textarea placeholder={placeholder} style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', color: 'var(--navy-dark)', fontSize: '1rem', padding: '2px 0', fontFamily: 'inherit', fontWeight: 500, resize: 'vertical', minHeight: '80px' }}></textarea>
      ) : type === 'file' ? (
        <input type="file" style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', color: 'var(--navy-dark)', fontSize: '0.9rem', padding: '2px 0', fontFamily: 'inherit', fontWeight: 500 }} />
      ) : options ? (
        <select disabled={disabled} style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', color: disabled ? '#94a3b8' : 'var(--navy-dark)', fontSize: '1rem', padding: '2px 0', fontFamily: 'inherit', appearance: 'none', fontWeight: 500 }}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', color: 'var(--navy-dark)', fontSize: '1rem', padding: '2px 0', fontFamily: 'inherit', fontWeight: 500 }} />
      )}
      {options && <svg style={{position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'}} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh' }}>
        <LoginCard 
          title="Admin Login" 
          buttonText="Login" 
          onLogin={handleLogin} 
        />
      </div>
    );
  }

  const sidebarItems = ['Room Reservations', 'Starlink Installations', 'Featured Rooms', 'Highlights'];

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
          <span style={{ fontWeight: '700', color: 'var(--navy-dark)', fontSize: '0.95rem' }}>Welcome, {loggedUsername}</span>
          <button 
            onClick={() => setIsAuthenticated(false)}
            style={{ background: 'white', border: '1px solid #cbd5e1', color: 'var(--navy-dark)', fontWeight: '700', padding: '8px 20px', borderRadius: '30px', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--dict-blue)'; e.currentTarget.style.color = 'var(--dict-blue)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = 'var(--navy-dark)'; }}
          >
            Logout
          </button>
          <Link 
            to="/"
            style={{ textDecoration: 'none', background: 'white', border: '1px solid #cbd5e1', color: 'var(--navy-dark)', fontWeight: '700', padding: '8px 20px', borderRadius: '30px', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s', display: 'inline-block' }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--dict-blue)'; e.currentTarget.style.color = 'var(--dict-blue)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = 'var(--navy-dark)'; }}
          >
            Back to Site
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 40px' }}>
        <h1 style={{ color: 'var(--navy-dark)', fontSize: '2.2rem', fontWeight: '800', marginBottom: '30px', marginTop: 0 }}>
          Manage Bookings - {adminLocation}
        </h1>

        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
          
          {/* Sidebar */}
          <div style={{ width: '260px', flexShrink: 0, background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', overflow: 'hidden', padding: '20px 0' }}>
            {sidebarItems.map(item => (
              <div 
                key={item}
                onClick={() => setActiveTab(item)}
                style={{
                  padding: '16px 24px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  color: activeTab === item ? 'var(--navy-dark)' : '#64748b',
                  background: activeTab === item ? '#f0f4f8' : 'transparent',
                  borderLeft: activeTab === item ? '4px solid var(--dict-blue)' : '4px solid transparent',
                  transition: 'background 0.2s, color 0.2s'
                }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', padding: '30px 40px', minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0, color: 'var(--navy-dark)', fontSize: '1.6rem', fontWeight: '800' }}>{activeTab}</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                style={{ background: 'var(--ceb-navy)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '30px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0, 39, 94, 0.2)', transition: 'transform 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {activeTab === 'Featured Rooms' ? '+ Add Room' : activeTab === 'Highlights' ? '+ Add Highlight' : '+ Add Reservation'}
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  {activeTab === 'Featured Rooms' ? (
                    <tr>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>IMAGE</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>TITLE</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>LOCATION</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>BADGE</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>CAPACITY (PAX)</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>CHAIRS</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>TABLES</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>PCS</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>ACTION</th>
                    </tr>
                  ) : activeTab === 'Highlights' ? (
                    <tr>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>IMAGE</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>MONTH</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>DAY</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>TITLE</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>LINK</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>ACTION</th>
                    </tr>
                  ) : (
                    <tr>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>BOOKING ID</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>TIMESTAMP</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>LOCATION</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>EVENT NAME</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>FULL NAME</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>EMAIL</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {currentBookings.length === 0 ? (
                    <tr><td colSpan={activeTab === 'Featured Rooms' ? "9" : activeTab === 'Highlights' ? "6" : "6"} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No bookings found.</td></tr>
                  ) : currentBookings.map((b, i) => (
                    <tr key={b.id} style={{ borderBottom: i === currentBookings.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                      {activeTab === 'Featured Rooms' ? (
                        <React.Fragment>
                          <td style={{ padding: '20px 12px' }}><img src={b.image} alt={b.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}/></td>
                          <td style={{ padding: '20px 12px', color: 'var(--navy-dark)', fontSize: '0.85rem', fontWeight: '700' }}>{b.title.split(' ').map((w, j) => <React.Fragment key={j}>{w}<br/></React.Fragment>)}</td>
                          <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.85rem' }}>{b.loc}</td>
                          <td style={{ padding: '20px 12px' }}>
                            <span style={{ background: b.badgeBg, color: b.badgeColor, padding: b.badgeBg !== 'transparent' ? '4px 8px' : '0', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                              {b.badge}
                            </span>
                          </td>
                          <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.85rem' }}>{b.pax}</td>
                          <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.85rem' }}>{b.chairs}</td>
                          <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.85rem' }}>{b.tables}</td>
                          <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.85rem' }}>{b.pcs}</td>
                          <td style={{ padding: '20px 12px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{cursor: 'pointer'}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{cursor: 'pointer'}}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </div>
                          </td>
                        </React.Fragment>
                      ) : activeTab === 'Highlights' ? (
                        <React.Fragment>
                          <td style={{ padding: '20px 12px' }}><img src={b.image} alt={b.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}/></td>
                          <td style={{ padding: '20px 12px', color: 'var(--navy-dark)', fontSize: '0.85rem', fontWeight: '800' }}>{b.month}</td>
                          <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.85rem' }}>{b.day}</td>
                          <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.85rem' }}>{b.title}</td>
                          <td style={{ padding: '20px 12px', color: 'var(--dict-blue)', fontSize: '0.85rem' }}><a href={b.link} style={{color: 'inherit', textDecoration: 'none'}}>Link</a></td>
                          <td style={{ padding: '20px 12px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{cursor: 'pointer'}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{cursor: 'pointer'}}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </div>
                          </td>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <td style={{ padding: '20px 12px', color: 'var(--navy-dark)', fontSize: '0.85rem', fontWeight: '800' }}>{b.id}</td>
                          <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.85rem' }}>{b.timestamp}</td>
                          <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.85rem' }}>
                            {b.loc1}<br/>{b.loc2}
                          </td>
                          <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.85rem' }}>
                            {b.event1}{b.event2 && <br/>}{b.event2}
                          </td>
                          <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.85rem' }}>
                            {b.name1}<br/>{b.name2}
                          </td>
                          <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.85rem' }}>{b.email}</td>
                        </React.Fragment>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Admin Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <h2 style={{ margin: '0 0 30px 0', color: 'var(--navy-dark)', fontSize: '1.6rem', fontWeight: '800' }}>
              {activeTab === 'Featured Rooms' ? 'Add Featured Room' : activeTab === 'Highlights' ? 'Add Highlight' : activeTab === 'Starlink Installations' ? 'Add Starlink Reservation' : 'Add Room Reservation'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {activeTab === 'Featured Rooms' ? (
                <React.Fragment>
                  <FloatingField label="Location" options={[adminLocation]} disabled={true} width="100%" />
                  <FloatingField label="Room Title" width="100%" />
                  <FloatingField label="Room Image" type="file" width="100%" />
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <FloatingField label="Badge Text" width="1" />
                    <FloatingField label="Badge Style (CSS)" placeholder="e.g. background:#e74c3c; color:white" width="2" />
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <FloatingField label="Max Pax" type="number" width="1" />
                    <FloatingField label="Chairs" type="number" width="1" />
                    <FloatingField label="Tables" type="number" width="1" />
                    <FloatingField label="PCs" type="number" width="1" />
                  </div>
                </React.Fragment>
              ) : activeTab === 'Highlights' ? (
                <React.Fragment>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <FloatingField label="Month" placeholder="e.g. OCT" width="3" />
                    <FloatingField label="Day" placeholder="21" width="1" />
                  </div>
                  <FloatingField label="Title" width="100%" />
                  <FloatingField label="Image" type="file" width="100%" />
                  <FloatingField label="Link (Optional)" placeholder="#" width="100%" />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <FloatingField label="DTC Location" options={[adminLocation]} disabled={true} width={activeTab === 'Starlink Installations' ? "1" : "1"} />
                    {activeTab !== 'Starlink Installations' && (
                      <FloatingField label="Room Type" options={['Select a Room', 'Conference Room', 'Training Center', 'Meeting Room']} width="1" />
                    )}
                    {activeTab === 'Starlink Installations' && <div style={{ flex: 1 }}></div>}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <FloatingField label="Start" type="datetime-local" width="1" />
                    <FloatingField label="End" type="datetime-local" width="1" />
                  </div>

                  <FloatingField label="Event Name" width="100%" />

                  <div style={{ display: 'flex', gap: '20px' }}>
                    <FloatingField label="Full Name" width="1" />
                    <FloatingField label="Email Address" width="1" />
                  </div>

                  <div style={{ display: 'flex', gap: '20px' }}>
                    <FloatingField label="Phone Number" width={activeTab === 'Starlink Installations' ? "1" : "2"} />
                    {activeTab !== 'Starlink Installations' && (
                      <FloatingField label="Participants" type="number" width="1" />
                    )}
                    {activeTab === 'Starlink Installations' && <div style={{ flex: 1 }}></div>}
                  </div>

                  <FloatingField label="Notes" type="textarea" width="100%" />
                  
                  <FloatingField label="Request Letter (Upload new to replace)" type="file" width="100%" />
                </React.Fragment>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '35px' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'white', border: '1px solid #cbd5e1', color: 'var(--navy-dark)', fontWeight: '700', padding: '12px 30px', borderRadius: '30px', cursor: 'pointer', fontSize: '1.05rem', transition: 'all 0.2s' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => { alert(activeTab === 'Featured Rooms' ? 'Room saved!' : activeTab === 'Highlights' ? 'Highlight saved!' : 'Reservation added!'); setIsModalOpen(false); }}
                style={{ background: 'var(--ceb-navy)', border: 'none', color: 'white', fontWeight: '700', padding: '12px 30px', borderRadius: '30px', cursor: 'pointer', fontSize: '1.05rem', boxShadow: '0 4px 10px rgba(0, 39, 94, 0.2)', transition: 'transform 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {activeTab === 'Featured Rooms' ? 'Save Room' : activeTab === 'Highlights' ? 'Save Highlight' : 'Add Reservation'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
