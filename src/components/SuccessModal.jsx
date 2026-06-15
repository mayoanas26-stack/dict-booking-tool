import React from 'react';

export default function SuccessModal({ isOpen, onClose, type, bookingId }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '420px',
        padding: '40px 32px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        textAlign: 'center',
        animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#ebf8f0',
          color: '#27ae60',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto'
        }}>
          <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h2 style={{ 
          margin: '0 0 16px', 
          fontSize: '1.75rem', 
          fontWeight: 800, 
          color: 'var(--navy-dark)' 
        }}>
          Request Submitted!
        </h2>
        
        <p style={{ 
          margin: '0 0 8px', 
          fontSize: '1.05rem', 
          color: 'var(--text-muted)',
          lineHeight: 1.5
        }}>
          Your {type} request has been sent and is pending admin review.
        </p>

        {bookingId && (
          <p style={{
            margin: '0 0 32px',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            fontWeight: 500
          }}>
            Booking ID: <span style={{ color: 'var(--dict-blue)', fontWeight: 700 }}>{bookingId}</span>
          </p>
        )}

        <button 
          onClick={onClose}
          style={{
            width: '100%',
            padding: '16px',
            background: 'var(--navy-dark)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s, transform 0.1s'
          }}
          onMouseOver={e => e.currentTarget.style.background = '#001b44'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--navy-dark)'}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Close
        </button>

      </div>
    </div>
  );
}
