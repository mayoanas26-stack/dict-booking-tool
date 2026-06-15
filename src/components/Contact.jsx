import React from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
  };

  return (
    <section id="contact" className="section-padding" style={{ background: 'var(--bg-light)' }}>
      <div className="container">
        <div className="section-heading">
          <h2>Contact Us</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Reach out to the facility management team</p>
        </div>
        <div className="form-section" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <form id="contact-form" onSubmit={handleContactSubmit}>
            <div className="responsive-grid" style={{ '--grid-cols': '1fr 1fr' }}>
              <div className="modal-field">
                <label>Name</label>
                <input type="text" id="contact-name" required />
              </div>
              <div className="modal-field">
                <label>Email Address</label>
                <input type="email" id="contact-email" required />
              </div>
            </div>
            <div className="modal-field" style={{ marginTop: '15px' }}>
              <label>Subject</label>
              <input type="text" id="contact-subject" required />
            </div>
            <div className="modal-field" style={{ marginTop: '15px' }}>
              <label>Message</label>
              <textarea id="contact-message" rows="5" style={{ resize: 'vertical', paddingTop: '15px' }} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
