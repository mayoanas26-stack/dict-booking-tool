import React from 'react';

export default function Footer() {
  return (
    <footer id="site-footer">
      <div className="container">
        <div className="footer-main-wrapper">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>BOOK</h4>
              <ul className="footer-links">
                <li><a href="#rooms">Room Booking</a></li>
                <li><a href="#starlink">Starlink Internet</a></li>
                <li><a href="#rooms">Room Upgrades</a></li>
              </ul>
              <div className="footer-country-select">
                <span style={{ flexGrow: 1, fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' }}>Philippines</span>
              </div>
            </div>

            <div className="footer-col">
              <h4>MANAGE</h4>
              <ul className="footer-links">
                <li><a href="/admin">Admin Portal</a></li>
                <li><a href="/manage">My Bookings</a></li>
                <li><a href="/manage">Starlink Status</a></li>
                <li><a href="#contact">Report Issue</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>RESOURCES</h4>
              <ul className="footer-links">
                <li><a href="#">Amenities</a></li>
                <li><a href="#">Floor Plan</a></li>
                <li><a href="#">Guidelines</a></li>
                <li><a href="#highlights">Highlights</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>ABOUT</h4>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-sidebar">
            <div className="sidebar-section">
              <h4>DICT DTC PLATFORMS</h4>
              <div className="badges-row">
                <div className="app-badge">iOS App</div>
                <div className="app-badge">Android</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-container">
          <div className="footer-copyright">
            &copy; Copyright {new Date().getFullYear()} DICT Digital Transformation Center
          </div>
        </div>
      </div>
    </footer>
  );
}
