import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { searchBookingsAPI } from '../api/apiService';
import toast from 'react-hot-toast';

export default function ManageBookings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [bookings, setBookings] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    
    const { data, error } = await searchBookingsAPI(searchQuery.trim());
    
    if (error) {
      toast.error('Search failed: ' + error);
      setBookings([]);
    } else {
      setBookings(data || []);
      if (data.length === 0) toast('No bookings found for that details.', { icon: 'ℹ️' });
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-light)' }}>
        {/* Header Section */}
        <div style={{ backgroundColor: 'var(--dict-blue)', padding: '160px 0 80px', color: 'white', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>Manage Your Bookings</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Enter your Email Address or Phone Number to view your reservations for Rooms and Starlink Internet.
            </p>
          </div>
        </div>

        {/* Search Widget */}
        <div className="container" style={{ marginTop: '-35px', position: 'relative', zIndex: 10 }}>
          <form 
            onSubmit={handleSearch} 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              background: 'white', 
              padding: '10px 10px 10px 25px', 
              borderRadius: '50px', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
              maxWidth: '750px', 
              margin: '0 auto',
              border: '1px solid #f1f5f9'
            }}
          >
            <div style={{ marginRight: '15px', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Enter Email Address or Phone Number" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '15px 0', 
                  paddingRight: '50px', 
                  fontSize: '1.05rem', 
                  border: 'none', 
                  outline: 'none', 
                  background: 'transparent',
                  color: 'var(--navy-dark)',
                  fontWeight: 500
                }}
              />
              {searchQuery.length > 0 && (
                <button 
                  type="button" 
                  onClick={() => { setSearchQuery(''); setBookings([]); setHasSearched(false); }} 
                  style={{ 
                    position: 'absolute', 
                    right: '15px', 
                    background: 'rgba(0,0,0,0.05)', 
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    border: 'none', 
                    color: '#64748b', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = 'var(--dict-blue)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = '#64748b'; }}
                  title="Clear search"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              )}
            </div>
            
            <button 
              type="submit" 
              style={{ 
                padding: '16px 40px', 
                borderRadius: '40px', 
                background: 'var(--dict-blue)', 
                color: 'white', 
                fontWeight: 600, 
                fontSize: '1.05rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 59, 140, 0.3)',
                transition: 'all 0.3s',
                marginLeft: '10px'
              }} 
              disabled={isLoading}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 59, 140, 0.4)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 59, 140, 0.3)'; }}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="container" style={{ padding: '60px 20px' }}>
          {hasSearched ? (
            <div>
              <h3 style={{ marginBottom: '20px', color: 'var(--navy-dark)' }}>Search Results</h3>
              {bookings.length > 0 ? (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {bookings.map(booking => (
                    <div key={booking.id} style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--dict-blue)' }}>{booking.id}</span>
                          <span style={{ 
                            padding: '4px 12px', 
                            borderRadius: '50px', 
                            fontSize: '0.75rem', 
                            fontWeight: 'bold',
                            backgroundColor: booking.status === 'Confirmed' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(241, 196, 15, 0.1)',
                            color: booking.status === 'Confirmed' ? '#27ae60' : '#f39c12'
                          }}>
                            {booking.status}
                          </span>
                        </div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '1.2rem' }}>{booking.eventName}</h4>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          {booking.type} • {booking.location} • {booking.date}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => toast('For cancellations or updates, please contact the DTC Admin.')} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Contact Admin</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: 'var(--radius)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No bookings found for "{searchQuery}". Please verify your details.</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1" fill="none" style={{ marginBottom: '15px', opacity: 0.5 }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <p>Enter your details above to manage your reservations.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
