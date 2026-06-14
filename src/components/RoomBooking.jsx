import React, { useState } from 'react';
import { submitBooking } from '../api/mockApi';

export default function RoomBooking() {
  const [formData, setFormData] = useState({
    dtcOffice: '',
    roomType: '',
    checkIn: '',
    checkOut: '',
    participants: '',
    eventName: '',
    fullName: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await submitBooking({ ...formData, type: 'room' });
      if (result.success) {
        alert('Booking submitted successfully! Booking ID: ' + result.bookingId);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error submitting booking');
    }
  };

  return (
    <form id="room-form" onSubmit={handleRoomSubmit}>
      <div className="booking-row">
        <div className="booking-inputs-wrapper">
          <div className="form-group-inline" style={{ flex: 1.4 }}>
            <label className="form-label">DTC Location</label>
            <select name="dtcOffice" className="form-control" onChange={handleChange} required value={formData.dtcOffice}>
              <option value="">Select Location</option>
              <option value="Iligan City, LDN">Iligan City</option>
              <option value="Maramag, Bukidnon">Maramag</option>
              <option value="Tubod, LDN">Tubod</option>
            </select>
          </div>
          <div className="form-group-inline" style={{ flex: 1.6 }}>
            <label className="form-label">Room Type</label>
            <select name="roomType" className="form-control" onChange={handleChange} required value={formData.roomType}>
              <option value="">Select a Room</option>
              <option value="Conference Room">Conference Room</option>
              <option value="Collaboration Room I">Collaboration Room I</option>
              <option value="Collaboration Room II">Collaboration Room II</option>
              <option value="Training Center">Training Center</option>
            </select>
          </div>
          <div className="form-group-inline" style={{ flex: 1.5 }}>
            <label className="form-label">Start <span className="text-danger">*</span></label>
            <input type="datetime-local" name="checkIn" className="form-control" onChange={handleChange} required value={formData.checkIn} />
          </div>
          <div className="form-group-inline" style={{ flex: 1.5 }}>
            <label className="form-label">End <span className="text-danger">*</span></label>
            <input type="datetime-local" name="checkOut" className="form-control" onChange={handleChange} required value={formData.checkOut} />
          </div>
          <div className="form-group-inline" style={{ flex: 1.2 }}>
            <label className="form-label">No. of Participants</label>
            <input type="number" name="participants" className="form-control" min="1" max="100" placeholder="1" onChange={handleChange} required value={formData.participants} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-search-inline">Submit</button>
      </div>

      <div className={`details-grid ${formData.dtcOffice ? 'show-details' : ''}`}>
        <div className="form-group">
          <label className="form-label">Event Name</label>
          <input type="text" name="eventName" className="form-control" placeholder="e.g. Project Launch" onChange={handleChange} required value={formData.eventName} />
        </div>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" name="fullName" className="form-control" placeholder="Juan Dela Cruz" onChange={handleChange} required value={formData.fullName} />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" name="email" className="form-control" placeholder="juan@example.com" onChange={handleChange} required value={formData.email} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input type="tel" name="phone" className="form-control" placeholder="0917 123 4567" onChange={handleChange} required value={formData.phone} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Notes (Optional)</label>
          <textarea name="notes" className="form-control" rows="3" style={{ resize: 'vertical', minHeight: '80px' }} placeholder="Any additional requirements or details?" onChange={handleChange} value={formData.notes}></textarea>
        </div>
        <div className="form-group col-span-2">
          <label className="form-label">Attach Request Letter</label>
          <input type="file" name="requestLetter" className="form-control" accept=".pdf,image/png,image/jpeg,image/jpg" />
        </div>
      </div>
    </form>
  );
}
