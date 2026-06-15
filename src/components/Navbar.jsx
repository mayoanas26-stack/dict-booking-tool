import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoWhite from '../assets/logo-white.png';
import logoColor from '../assets/logo-color.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [logoSrc, setLogoSrc] = useState(logoWhite);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseOver = () => {
    setLogoSrc(logoColor);
  };

  const handleMouseOut = () => {
    if (!scrolled) {
      setLogoSrc(logoWhite);
    }
  };

  return (
    <nav 
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div className="container nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">
            <img 
              id="header-logo" 
              src={scrolled ? logoColor : logoSrc}
              alt="DICT Logo" 
              style={{ width: '45px', height: 'auto', verticalAlign: 'middle', transition: 'all 0.3s ease', cursor: 'pointer' }}
            />
          </span>
          <div className="dict-text-wrapper">
            <div className="dict-text-top">REPUBLIC OF THE PHILIPPINES</div>
            <div className="dict-text-bottom">DEPARTMENT OF INFORMATION AND<br/>COMMUNICATIONS TECHNOLOGY</div>
          </div>
        </Link>
        <div className="nav-links">
          <div className="nav-item">
            <span onClick={() => { if(window.location.hash !== '#/') window.location.hash='#/'; setTimeout(()=>document.getElementById('home')?.scrollIntoView({behavior:'smooth'}), 100); }} className="nav-link" style={{cursor: 'pointer'}}>Home</span>
          </div>
          <div className="nav-item">
            <span onClick={() => { if(window.location.hash !== '#/') window.location.hash='#/'; setTimeout(()=>document.getElementById('rooms')?.scrollIntoView({behavior:'smooth'}), 100); }} className="nav-link" style={{cursor: 'pointer'}}>Rooms</span>
          </div>
          <div className="nav-item">
            <Link to="/manage" className="nav-link">Manage</Link>
          </div>
          <div className="nav-item">
            <Link to="/contact" className="nav-link">Support</Link>
          </div>
          <div className="nav-item">
            <span onClick={() => { if(window.location.hash !== '#/') window.location.hash='#/'; setTimeout(()=>document.getElementById('about')?.scrollIntoView({behavior:'smooth'}), 100); }} className="nav-link" style={{cursor: 'pointer'}}>About</span>
          </div>
        </div>
        <div className="nav-actions">
          <a href="#" className="nav-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-search" width="20" height="20">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
