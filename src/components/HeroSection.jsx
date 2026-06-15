import React, { useState, useEffect } from 'react';
import BookingWidget from './BookingWidget';
import heroEvent from '../assets/hero-event.jpg';

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    heroEvent,
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="home" className="hero">
      {/* Left Social Icons */}
      <div className="social-sidebar">
        <a href="#" title="Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="14" height="14">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        </a>
        <a href="#" title="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
        <a href="#" title="YouTube">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="14" height="14">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.13 1 12 1 12s0 3.87.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.87 23 12 23 12s0-3.87-.46-5.58z"></path>
            <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
          </svg>
        </a>
        <a href="#" title="Twitter">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="14" height="14">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
          </svg>
        </a>
      </div>

      {/* Background Slider */}
      <div className="hero-slider">
        {slides.map((url, index) => (
          <div 
            key={index}
            className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url('${url}')` }}
          ></div>
        ))}
      </div>

      <div className="container hero-container">
        <div className="hero-content">
          {/* Slider Dots */}
          <div className="hero-dots">
            {slides.map((_, index) => (
              <div 
                key={index} 
                className={`dot ${index === activeSlide ? 'active' : ''}`} 
                onClick={() => setActiveSlide(index)}
              ></div>
            ))}
          </div>

          {/* Booking Widget */}
          <div id="booking-widget">
            <BookingWidget />
          </div>
        </div>
      </div>
    </section>
  );
}
