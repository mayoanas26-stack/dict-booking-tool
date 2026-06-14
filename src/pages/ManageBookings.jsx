import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ManageBookings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  // Mock data for search results
  const [bookings, setBookings] = useState([
    {
      id: 'BK-10492',
      eventName: 'Project Launch',
      location: 'Iligan City',
      type: 'Conference Room',
      date: '2026-06-20',
      status: 'Confirmed'
    },
    {
      id: 'SB-88391',
      eventName: 'Remote Setup',
      location: 'Maramag',
      type: 'Starlink Internet',
      date: '2026-06-25',
      status: 'Pending'
    }
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    // In a real app, this would fetch from the API using searchQuery
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '100px', minHeight: '80vh', backgroundColor: 'var(--bg-light)' }}>
        {/* Header Section */}
        <div style={{ backgroundColor: 'var(--dict-blue)', padding: '60px 0 40px', color: 'white', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>Manage Your Bookings</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Enter your Booking ID or Email Address to view, update, or cancel your reservations for Rooms and Starlink Internet.
            </p>
          </div>
        </div>

        {/* Search Widget */}
        <div className="container" style={{ marginTop: '-30px', position: 'relative', zIndex: 10 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', maxWidth: '800px', margin: '0 auto' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter Booking ID (e.g., BK-10492) or Email" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
                style={{ flex: 1, padding: '15px', fontSize: '1rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 30px' }}>
                Search
              </button>
            </form>
          </div>
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
                        <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>View Details</button>
                        {booking.status === 'Pending' && (
                          <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', color: '#e74c3c', borderColor: '#e74c3c' }}>Cancel</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: 'var(--radius)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No bookings found for "{searchQuery}". Please verify your Booking ID or Email.</p>
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
