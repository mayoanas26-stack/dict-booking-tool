import React, { useState } from 'react';

export default function FeaturedRooms() {
  const [activeTab, setActiveTab] = useState('Iligan City');

  const rooms = {
    'Iligan City': [
      {
        title: 'Conference Room',
        img: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=400&q=80',
        pax: '20', chairs: '20', tables: '1', pcs: '0',
        badge: 'Popular', badgeStyle: 'background-color: #2ecc71; color: white;'
      },
      {
        title: 'Training Center',
        img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
        pax: '50', chairs: '50', tables: '10', pcs: '25',
        badge: 'Large', badgeStyle: 'background-color: #3498db; color: white;'
      }
    ],
    'Maramag': [
      {
        title: 'Collaboration Room',
        img: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=400&q=80',
        pax: '10', chairs: '10', tables: '2', pcs: '0',
        badge: 'New', badgeStyle: 'background-color: #e74c3c; color: white;'
      }
    ],
    'Tubod': []
  };

  return (
    <section id="rooms" className="section-padding" style={{ background: 'var(--bg-light)' }}>
      <div className="container">
        <div className="section-heading">
          <h2>Featured Rooms</h2>
          <div className="location-tabs" id="location-tabs">
            {['Iligan City', 'Maramag', 'Tubod'].map(loc => (
              <button 
                key={loc}
                className={`loc-tab ${activeTab === loc ? 'active' : ''}`} 
                onClick={() => setActiveTab(loc)}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
        <div className="cards-grid" id="featured-rooms-grid">
          {rooms[activeTab]?.length > 0 ? (
            rooms[activeTab].map((room, idx) => (
              <div className="card" key={idx}>
                <div className="card-img">
                  <span className="card-badge" style={{ backgroundColor: '#2ecc71', color: 'white' }}>{room.badge}</span>
                  <img src={room.img} alt={room.title} />
                </div>
                <div className="card-body">
                  <h3 className="card-title">{room.title}</h3>
                  <ul className="room-details">
                    <li><span className="detail-label">Max Pax</span><span className="detail-value">{room.pax}</span></li>
                    <li><span className="detail-label">Chairs</span><span className="detail-value">{room.chairs}</span></li>
                    <li><span className="detail-label">Tables</span><span className="detail-value">{room.tables}</span></li>
                    <li><span className="detail-label">PCs</span><span className="detail-value">{room.pcs}</span></li>
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>No featured rooms available at this location yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
