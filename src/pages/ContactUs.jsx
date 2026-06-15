import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for sending message
    setTimeout(() => {
      toast.success('Your message has been sent to the facility management team!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      
      <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
        {/* 
          We add a solid dark blue block at the very top 
          so that the transparent Navbar's white text is perfectly visible.
        */}
        <div style={{ backgroundColor: 'var(--dict-blue)', height: '100px', width: '100%' }}></div>

        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ color: 'var(--navy-dark)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>Contact Us</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Reach out to the facility management team
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    border: '1px solid #cbd5e1', 
                    fontSize: '1rem',
                    outlineColor: 'var(--dict-blue)'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    border: '1px solid #cbd5e1', 
                    fontSize: '1rem',
                    outlineColor: 'var(--dict-blue)'
                  }}
                />
              </div>
            </div>

            <div>
              <input 
                type="text" 
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '15px', 
                  borderRadius: '8px', 
                  border: '1px solid #cbd5e1', 
                  fontSize: '1rem',
                  outlineColor: 'var(--dict-blue)'
                }}
              />
            </div>

            <div>
              <textarea 
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                style={{ 
                  width: '100%', 
                  padding: '15px', 
                  borderRadius: '8px', 
                  border: '1px solid #cbd5e1', 
                  fontSize: '1rem',
                  outlineColor: 'var(--dict-blue)',
                  resize: 'vertical'
                }}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ 
                marginTop: '10px',
                width: '100%', 
                padding: '16px', 
                backgroundColor: 'var(--navy-dark)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '50px', 
                fontSize: '1.1rem', 
                fontWeight: 700, 
                cursor: 'pointer',
                transition: 'background 0.3s, transform 0.2s',
                boxShadow: '0 4px 15px rgba(0,39,94,0.3)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--dict-blue)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--navy-dark)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
