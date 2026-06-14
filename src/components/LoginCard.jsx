import React, { useState } from 'react';

export default function LoginCard({ title, buttonText, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username, password);
    } else {
      alert('Please enter both username and password.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '20px' }}>
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '50px 40px', 
        width: '100%', 
        maxWidth: '420px', 
        boxShadow: '0 10px 40px rgba(0, 59, 140, 0.08)' 
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          color: 'var(--ceb-navy)', 
          fontSize: '1.75rem', 
          fontWeight: '800', 
          marginBottom: '35px',
          marginTop: 0
        }}>
          {title}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div style={{ 
            position: 'relative', 
            border: '1px solid #cbd5e1', 
            borderRadius: '8px', 
            padding: '8px 16px', 
            marginBottom: '20px',
            backgroundColor: 'white'
          }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.8rem', 
              color: '#64748b', 
              fontWeight: 500,
              marginBottom: '2px' 
            }}>
              Username
            </label>
            <input 
              type="text" 
              placeholder="e.g. admin.juan" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ 
                border: 'none', 
                background: 'transparent', 
                width: '100%', 
                outline: 'none', 
                color: 'var(--navy-dark)', 
                fontSize: '1.05rem', 
                padding: '4px 0',
                fontFamily: 'inherit'
              }} 
            />
          </div>

          {/* Password Field */}
          <div style={{ 
            position: 'relative', 
            border: '1px solid #cbd5e1', 
            borderRadius: '8px', 
            padding: '8px 16px', 
            marginBottom: '35px',
            backgroundColor: 'white'
          }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.8rem', 
              color: '#64748b', 
              fontWeight: 500,
              marginBottom: '2px' 
            }}>
              Password
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  border: 'none', 
                  background: 'transparent', 
                  width: '100%', 
                  outline: 'none', 
                  color: 'var(--navy-dark)', 
                  fontSize: '1.05rem', 
                  padding: '4px 0',
                  fontFamily: 'inherit',
                  letterSpacing: showPassword ? 'normal' : '2px'
                }} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#64748b', 
                  cursor: 'pointer',
                  padding: '0 5px'
                }}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              background: 'var(--ceb-navy)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '30px', 
              padding: '14px', 
              fontSize: '1.1rem', 
              fontWeight: '700', 
              cursor: 'pointer',
              boxShadow: '0 6px 15px rgba(0, 39, 94, 0.2)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 39, 94, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 39, 94, 0.2)';
            }}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
