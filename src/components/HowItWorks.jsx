import React from 'react';

export default function HowItWorks() {
  return (
    <section id="about" className="section-padding" style={{ background: 'var(--white)' }}>
      <div className="container">
        <div className="section-heading">
          <h2>How It Works</h2>
        </div>
        <div className="steps">
          <div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h4>1. Search & Select Facility</h4>
            <p className="text-muted">Browse through our available conference rooms, collaboration spaces, or Starlink internet plans to find the right fit for your needs.</p>
          </div>
          <div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <h4>2. Submit Booking Request</h4>
            <p className="text-muted">Fill out the secure online reservation form with your contact details, exact schedule, and any special requirements.</p>
          </div>
          <div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h4>3. Receive Confirmation</h4>
            <p className="text-muted">Get an instant email confirmation with your unique booking reference ID and necessary guidelines for your visit.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
