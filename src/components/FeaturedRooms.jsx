import React, { useState, useEffect } from 'react';
import { fetchFeaturedRoomsAPI } from '../api/apiService';

export default function FeaturedRooms() {
  const [activeTab, setActiveTab] = useState('Iligan City');

  const [rooms, setRooms] = useState({ 'Iligan City': [], 'Maramag': [], 'Tubod': [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await fetchFeaturedRoomsAPI();
      if (!error && data) {
        setRooms(data);
      }
      setIsLoading(false);
    };
    
    fetchRooms();
  }, []);

  return (
    <section id="rooms" style={{ background: '#f8fafc', padding: '80px 0', fontFamily: 'Inter, sans-serif' }}>
      <div className="container" style={{ margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--navy-dark)', fontSize: '2.2rem', fontWeight: '800', marginBottom: '40px' }}>
          Featured Rooms
        </h2>
        
        <div className="frc-tabs">
          {['Iligan City', 'Maramag', 'Tubod'].map(loc => (
            <button 
              key={loc}
              className={`frc-tab ${activeTab === loc ? 'active' : ''}`} 
              onClick={() => setActiveTab(loc)}
            >
              {loc}
            </button>
          ))}
        </div>

        <style>{`
          @keyframes skeleton-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
          .skeleton-box { background-color: #e2e8f0; border-radius: 4px; }
        `}</style>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '30px' }}>
          {isLoading ? (
            [1, 2, 3, 4].map((n) => (
              <div className="featured-room-card" key={`skel-${n}`} style={{ animation: 'skeleton-pulse 1.5s infinite' }}>
                <div className="frc-image-wrapper skeleton-box" style={{ borderRadius: '0' }}></div>
                <div className="frc-content">
                  <div className="skeleton-box" style={{ height: '28px', width: '60%', marginBottom: '20px' }}></div>
                  <div className="frc-details">
                    {[1, 2, 3, 4].map((i) => (
                      <div className="frc-detail-row" key={`detail-${i}`}>
                        <div className="skeleton-box" style={{ height: '20px', width: '70px' }}></div>
                        <div className="skeleton-box" style={{ height: '20px', width: '25px' }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : rooms[activeTab]?.length > 0 ? (
            rooms[activeTab].map((room, idx) => (
              <div className="featured-room-card" key={idx}>
                <div className="frc-image-wrapper">
                  {room.badge && (
                    <span className="frc-badge" style={{ backgroundColor: room.badgeStyle.includes('#2ecc71') ? '#2ecc71' : room.badgeStyle.includes('#3498db') ? '#003b8c' : '#ef4444', color: 'white' }}>
                      {room.badge}
                    </span>
                  )}
                  <img src={room.img} alt={room.title} className="frc-image" />
                </div>
                <div className="frc-content">
                  <h3 className="frc-title">{room.title}</h3>
                  <div className="frc-details">
                    <div className="frc-detail-row">
                      <span className="frc-label">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Max Pax
                      </span>
                      <span className="frc-value">{room.pax}</span>
                    </div>
                    <div className="frc-detail-row">
                      <span className="frc-label">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        Chairs
                      </span>
                      <span className="frc-value">{room.chairs}</span>
                    </div>
                    <div className="frc-detail-row">
                      <span className="frc-label">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                        Tables
                      </span>
                      <span className="frc-value">{room.tables}</span>
                    </div>
                    <div className="frc-detail-row">
                      <span className="frc-label">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                        PCs
                      </span>
                      <span className="frc-value">{room.pcs}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>
              No featured rooms available at this location yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
