import React, { useState, useEffect } from 'react';
import LoginCard from '../components/LoginCard';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const FloatingField = ({ label, name, placeholder, type = "text", width = '100%', options = null, disabled = false, accept = "image/*", formData, setFormData }) => {
  const value = disabled ? (options ? options[0] : '') : (formData[name] || '');
  
  const handleChange = (e) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  return (
    <div className="floating-group" style={{ gridColumn: width === '100%' ? '1 / -1' : `span ${width}` }}>
      {type === 'textarea' ? (
        <textarea 
          className={`floating-input ${value ? 'has-value' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
        ></textarea>
      ) : type === 'file' ? (
        <input 
          type="file" 
          className="floating-input has-value"
          accept={accept}
          onChange={e => {
            if (e.target.files && e.target.files.length > 0) {
              setFormData({ ...formData, [name]: e.target.files[0] });
            }
          }}
          disabled={disabled}
        />
      ) : options ? (
        <React.Fragment>
          <select 
            className={`floating-input ${value || disabled ? 'has-value' : ''}`}
            disabled={disabled}
            value={value}
            onChange={handleChange}
          >
            {!disabled && <option value="" disabled hidden></option>}
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <svg style={{position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'}} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </React.Fragment>
      ) : (
        <input 
          type={type} 
          className={`floating-input ${value ? 'has-value' : ''}`}
          placeholder={placeholder || ' '}
          value={value}
          onChange={handleChange}
          disabled={disabled}
        />
      )}
      <label className="floating-label">{label}</label>
    </div>
  );
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminLocation, setAdminLocation] = useState('');
  const [loggedUsername, setLoggedUsername] = useState('');
  const [activeTab, setActiveTab] = useState('Room Reservations');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [dbRooms, setDbRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const initialFormState = {
    title: '', image_url: '', image_file: null, badge_text: '', badge_style: '', max_pax: '', chairs: '', tables: '', pcs: '', // Rooms
    month: '', day: '', link_url: '', // Highlights
    room_type: '', start_time: '', end_time: '', event_name: '', first_name: '', last_name: '', email: '', phone: '', participants: '', notes: '', request_letter_url: '', request_letter_file: null // Reservations
  };
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  const handleEditItem = (item, tab) => {
    setEditingId(item.id);
    if (tab === 'Featured Rooms') {
      setFormData({
        ...initialFormState,
        title: item.title,
        image_url: item.image_url,
        badge_text: item.badge_text || '',
        badge_style: item.badge_bg || '',
        max_pax: item.max_pax || '',
        chairs: item.chairs || '',
        tables: item.tables || '',
        pcs: item.pcs || ''
      });
    } else if (tab === 'Highlights') {
      setFormData({
        ...initialFormState,
        title: item.title,
        month: item.month,
        day: item.day,
        image_url: item.image_url,
        link_url: item.link_url || ''
      });
    } else if (tab === 'Room Reservations' || tab === 'Starlink Installations') {
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      };
      setFormData({
        ...initialFormState,
        room_type: item.room_type || '',
        start_time: formatDate(item.start_time),
        end_time: formatDate(item.end_time),
        event_name: item.event_name || '',
        first_name: item.first_name || '',
        last_name: item.last_name || '',
        email: item.email || '',
        phone: item.phone_number || '',
        participants: item.participants || '',
        notes: item.notes || '',
        request_letter_url: item.request_letter_url || '',
        request_letter_file: null
      });
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        handleAuthSession(session);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setLoggedUsername('');
        setAdminLocation('');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuthSession = async (session) => {
    if (session?.user) {
      const email = session.user.email;
      const { data, error } = await supabase
        .from('user_roles')
        .select('location')
        .eq('user_id', session.user.id)
        .single();

      if (data && data.location) {
        setAdminLocation(data.location);
        setLoggedUsername(email.split('@')[0]);
        setIsAuthenticated(true);
      } else {
        toast.error('Access Denied. You do not have an assigned admin role.');
        handleLogout();
      }
    }
  };

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    handleAuthSession(session);
  };

  const handleLogin = async (username, password) => {
    const email = username.includes('@') ? username : `${username}@iligan.com`;
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      toast.error('Invalid credentials: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const fetchData = async () => {
    setIsLoading(true);
    let tableName = '';
    
    if (activeTab === 'Room Reservations') tableName = 'room_reservations';
    else if (activeTab === 'Starlink Installations') tableName = 'starlink_reservations';
    else if (activeTab === 'Featured Rooms') tableName = 'featured_rooms';
    else if (activeTab === 'Highlights') tableName = 'highlights';

    let query = supabase
      .from(tableName)
      .select('*')
      .order(tableName === 'room_reservations' || tableName === 'starlink_reservations' ? 'created_at' : 'id', { ascending: false });

    // Ensure the admin only sees data from their specific DTC Location
    if (adminLocation) {
      if (tableName === 'featured_rooms') {
        query = query.eq('location', adminLocation);
      } else if (tableName === 'room_reservations' || tableName === 'starlink_reservations') {
        query = query.eq('dtc_location', adminLocation);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching data:', error);
      setCurrentBookings([]);
    } else {
      setCurrentBookings(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      if (adminLocation) {
        fetchDbRooms();
      }
    }
  }, [activeTab, isAuthenticated, adminLocation]);

  const fetchDbRooms = async () => {
    const { data, error } = await supabase
      .from('featured_rooms')
      .select('title')
      .eq('location', adminLocation);
    
    if (!error && data) {
      setDbRooms(data.map(r => r.title));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    let tableName = '';
    let payload = {};

    let uploadedImageUrl = formData.image_url;

    if (formData.image_file) {
      const file = formData.image_file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        toast.error('Error uploading image: ' + uploadError.message);
        setIsLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
        
      uploadedImageUrl = publicUrl;
    }

    let uploadedRequestLetterUrl = formData.request_letter_url;
    if (formData.request_letter_file) {
      const file = formData.request_letter_file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('request_letters')
        .upload(filePath, file);

      if (uploadError) {
        toast.error('Error uploading letter: ' + uploadError.message);
        setIsLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('request_letters')
        .getPublicUrl(filePath);
        
      uploadedRequestLetterUrl = publicUrl;
    }

    if (activeTab === 'Room Reservations') {
      tableName = 'room_reservations';
      payload = {
        dtc_location: adminLocation,
        room_type: formData.room_type,
        start_time: formData.start_time ? new Date(formData.start_time).toISOString() : null,
        end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null,
        event_name: formData.event_name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone,
        participants: parseInt(formData.participants) || null,
        notes: formData.notes,
        request_letter_url: uploadedRequestLetterUrl || formData.request_letter_url
      };
    } else if (activeTab === 'Starlink Installations') {
      tableName = 'starlink_reservations';
      payload = {
        dtc_location: adminLocation,
        start_time: formData.start_time ? new Date(formData.start_time).toISOString() : null,
        end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null,
        event_name: formData.event_name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone,
        notes: formData.notes,
        request_letter_url: uploadedRequestLetterUrl || formData.request_letter_url
      };
    } else if (activeTab === 'Featured Rooms') {
      tableName = 'featured_rooms';
      payload = {
        location: adminLocation,
        title: formData.title,
        image_url: uploadedImageUrl || formData.image_url,
        badge_text: formData.badge_text,
        badge_bg: formData.badge_style || '#2ecc71',
        badge_color: '#ffffff',
        max_pax: parseInt(formData.max_pax) || 0,
        chairs: parseInt(formData.chairs) || 0,
        tables: parseInt(formData.tables) || 0,
        pcs: parseInt(formData.pcs) || 0
      };
    } else if (activeTab === 'Highlights') {
      tableName = 'highlights';
      payload = {
        title: formData.title,
        month: formData.month,
        day: formData.day,
        image_url: uploadedImageUrl || formData.image_url,
        link_url: formData.link_url
      };
    }

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from(tableName).update(payload).eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from(tableName).insert([payload]);
      error = insertError;
    }
    
    if (error) {
      toast.error('Error saving: ' + error.message);
    } else {
      toast.success(editingId ? 'Updated successfully' : 'Saved successfully');
      setIsModalOpen(false);
      setFormData(initialFormState);
      setEditingId(null);
      fetchData();
      if (tableName === 'featured_rooms') fetchDbRooms();
    }
    setIsLoading(false);
  };

  const executeDelete = async (id, tabName) => {
    setIsLoading(true);
    let tableName = '';
    if (tabName === 'Room Reservations') tableName = 'room_reservations';
    else if (tabName === 'Starlink Installations') tableName = 'starlink_reservations';
    else if (tabName === 'Featured Rooms') tableName = 'featured_rooms';
    else if (tabName === 'Highlights') tableName = 'highlights';

    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      toast.error('Error deleting: ' + error.message);
    } else {
      toast.success('Record deleted successfully');
      fetchData();
      if (tableName === 'featured_rooms') fetchDbRooms();
    }
    setIsLoading(false);
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontWeight: 600, fontSize: '15px', color: '#fff' }}>Are you sure you want to delete this record?</span>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button style={{ padding: '6px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontWeight: 600 }} onClick={() => toast.dismiss(t.id)}>Cancel</button>
          <button style={{ padding: '6px 16px', borderRadius: '8px', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => { toast.dismiss(t.id); executeDelete(id, activeTab); }}>Delete</button>
        </div>
      </div>
    ), { duration: Infinity, style: { minWidth: '320px', background: '#1e293b', color: '#fff' } });
  };

  const handleStatusChange = async (id, newStatus) => {
    setIsLoading(true);
    let tableName = '';
    if (activeTab === 'Room Reservations') tableName = 'room_reservations';
    else if (activeTab === 'Starlink Installations') tableName = 'starlink_reservations';
    
    if (tableName) {
      const { error } = await supabase.from(tableName).update({ status: newStatus }).eq('id', id);
      if (error) {
        toast.error('Error updating status: ' + error.message);
      } else {
        toast.success('Status updated to ' + newStatus);
        fetchData();
      }
    }
    setIsLoading(false);
  };

  // FloatingField has been extracted to module scope

  if (!isAuthenticated) {
    return (
      <LoginCard 
        title="Admin Login" 
        buttonText="Login" 
        onLogin={handleLogin} 
      />
    );
  }

  const sidebarItems = [
    { name: 'Room Reservations', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
    { name: 'Starlink Installations', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> },
    { name: 'Featured Rooms', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
    { name: 'Highlights', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <header className="navbar-app">
        <div className="nav-container" style={{ padding: '0 40px', maxWidth: 'none' }}>
          <Link to="/" className="logo">
            <img src="https://lh3.googleusercontent.com/d/1MdTXBsrssyssWya97x8O2uVR2e3JAGU9" alt="DICT Logo" style={{ width: '45px', height: 'auto' }} />
            <div className="logo-text-wrapper">
              <span className="logo-text-main" style={{ fontSize: '1.2rem' }}>DICT Region X</span>
              <span className="logo-text-sub">Admin Portal</span>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Admin: <span style={{color: 'var(--navy-dark)'}}>{loggedUsername}</span></span>
            <button 
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ padding: '8px 20px', fontSize: '0.9rem' }}
            >
              Logout
            </button>
            <Link 
              to="/"
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.9rem' }}
            >
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 40px' }}>
        <h1 style={{ color: 'var(--navy-dark)', fontSize: '2.2rem', fontWeight: '800', marginBottom: '30px', marginTop: 0 }}>
          Manage Bookings <span style={{color: 'var(--text-muted)', fontWeight: 400, fontSize: '1.5rem'}}>| {adminLocation}</span>
        </h1>

        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
          
          {/* Sidebar */}
          <div style={{ width: '280px', flexShrink: 0, background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '24px 16px' }}>
            {sidebarItems.map(item => (
              <div 
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`sidebar-pill ${activeTab === item.name ? 'active' : ''}`}
              >
                {item.icon}
                {item.name}
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '30px 40px', minWidth: 0, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0, color: 'var(--navy-dark)', fontSize: '1.6rem', fontWeight: '800' }}>{activeTab}</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary"
              >
                {activeTab === 'Featured Rooms' ? '+ Add Room' : activeTab === 'Highlights' ? '+ Add Highlight' : '+ Add Reservation'}
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  {activeTab === 'Featured Rooms' ? (
                    <tr>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>IMAGE</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>TITLE</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>LOCATION</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>BADGE</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>CAPACITY</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>CHAIRS</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>TABLES</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>PCS</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>ACTION</th>
                    </tr>
                  ) : activeTab === 'Highlights' ? (
                    <tr>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>IMAGE</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>MONTH</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>DAY</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>TITLE</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>LINK</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>ACTION</th>
                    </tr>
                  ) : activeTab === 'Starlink Installations' ? (
                    <tr>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>ID</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>TIMESTAMP</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>LOCATION</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>EVENT NAME</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>FULL NAME</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>EMAIL</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>PHONE</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>START</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>END</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>NOTES</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>REQUEST LETTER</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>STATUS</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>ACTION</th>
                    </tr>
                  ) : (
                    <tr>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>ID</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>TIMESTAMP</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>LOCATION</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>EVENT NAME</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>FULL NAME</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>EMAIL</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>PHONE</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>ROOM TYPE</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>START</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>END</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>PARTICIPANTS</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>NOTES</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>REQUEST LETTER</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>STATUS</th>
                      <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', whiteSpace: 'nowrap' }}>ACTION</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading...</td></tr>
                  ) : currentBookings.length === 0 ? (
                    <tr><td colSpan={activeTab === 'Featured Rooms' ? "9" : activeTab === 'Highlights' ? "6" : "7"} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No data found.</td></tr>
                  ) : currentBookings.map((b, i) => (
                    <tr key={b.id} style={{ borderBottom: i === currentBookings.length - 1 ? 'none' : '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      {activeTab === 'Featured Rooms' ? (
                        <React.Fragment>
                          <td style={{ padding: '16px 12px' }}><img src={b.image_url} alt={b.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}/></td>
                          <td style={{ padding: '16px 12px', color: 'var(--navy-dark)', fontSize: '0.9rem', fontWeight: '600' }}>{b.title}</td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem' }}>{b.location}</td>
                          <td style={{ padding: '16px 12px' }}>
                            {b.badge_text && (
                              <span style={{ background: b.badge_bg || '#f1f5f9', color: b.badge_color || '#475569', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                                {b.badge_text}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem' }}>{b.max_pax}</td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem' }}>{b.chairs}</td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem' }}>{b.tables}</td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem' }}>{b.pcs}</td>
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleEditItem(b, activeTab)} className="btn-icon" style={{ background: '#f1f5f9', color: '#64748b' }} title="Edit"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg></button>
                              <button onClick={() => handleDelete(b.id)} className="btn-icon danger" title="Delete"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                            </div>
                          </td>
                        </React.Fragment>
                      ) : activeTab === 'Highlights' ? (
                        <React.Fragment>
                          <td style={{ padding: '16px 12px' }}><img src={b.image_url} alt={b.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}/></td>
                          <td style={{ padding: '16px 12px', color: 'var(--dict-blue)', fontSize: '0.9rem', fontWeight: '800' }}>{b.month}</td>
                          <td style={{ padding: '16px 12px', color: 'var(--navy-dark)', fontSize: '0.9rem', fontWeight: '600' }}>{b.day}</td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem' }}>{b.title}</td>
                          <td style={{ padding: '16px 12px', color: 'var(--dict-blue)', fontSize: '0.9rem', fontWeight: '500' }}><a href={b.link_url?.startsWith('http') ? b.link_url : '#'} target="_blank" rel="noreferrer" style={{color: 'inherit', textDecoration: 'underline'}}>Visit Link</a></td>
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleEditItem(b, activeTab)} className="btn-icon" style={{ background: '#f1f5f9', color: '#64748b' }} title="Edit"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg></button>
                              <button onClick={() => handleDelete(b.id)} className="btn-icon danger" title="Delete"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                            </div>
                          </td>
                        </React.Fragment>
                      ) : activeTab === 'Starlink Installations' ? (
                        <React.Fragment>
                          <td style={{ padding: '16px 12px' }}><span style={{background: '#f1f5f9', color: '#64748b', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600}}>{b.id.slice(0, 8).toUpperCase()}</span></td>
                          <td style={{ padding: '16px 12px', color: '#64748b', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{new Date(b.created_at).toLocaleString()}</td>
                          <td style={{ padding: '16px 12px', color: 'var(--navy-dark)', fontSize: '0.9rem', fontWeight: '500', whiteSpace: 'nowrap' }}>{b.dtc_location}</td>
                          <td style={{ padding: '16px 12px', color: 'var(--navy-dark)', fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap' }}>{b.event_name}</td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{b.first_name} {b.last_name}</td>
                          <td style={{ padding: '16px 12px', color: '#64748b', fontSize: '0.85rem' }}>{b.email}</td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{b.phone_number || '-'}</td>
                          <td style={{ padding: '16px 12px', color: '#64748b', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{new Date(b.start_time).toLocaleString()}</td>
                          <td style={{ padding: '16px 12px', color: '#64748b', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{new Date(b.end_time).toLocaleString()}</td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={b.notes}>{b.notes || '-'}</td>
                          <td style={{ padding: '16px 12px', color: 'var(--dict-blue)', fontSize: '0.9rem', fontWeight: '500' }}>
                            {b.request_letter_url ? <a href={b.request_letter_url} target="_blank" rel="noreferrer" style={{color: 'inherit', textDecoration: 'underline'}}>View Letter</a> : '-'}
                          </td>
                          <td style={{ padding: '16px 12px' }}>
                            <select 
                              value={b.status || 'Confirmed'} 
                              onChange={(e) => handleStatusChange(b.id, e.target.value)}
                              style={{ 
                                background: b.status === 'Pending' ? '#fef08a' : b.status === 'Cancelled' ? '#fecaca' : '#dcfce7', 
                                color: b.status === 'Pending' ? '#854d0e' : b.status === 'Cancelled' ? '#991b1b' : '#166534', 
                                padding: '4px 8px', 
                                borderRadius: '6px', 
                                fontSize: '0.75rem', 
                                fontWeight: 600,
                                border: '1px solid rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                outline: 'none'
                              }}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Pending">Pending</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => toast('View details clicked')} className="btn-icon" style={{ background: '#f1f5f9', color: '#64748b' }} title="View"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                              <button onClick={() => handleEditItem(b, activeTab)} className="btn-icon" style={{ background: '#f1f5f9', color: '#64748b' }} title="Edit"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg></button>
                              <button onClick={() => handleDelete(b.id)} className="btn-icon danger" title="Delete"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                            </div>
                          </td>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <td style={{ padding: '16px 12px' }}><span style={{background: '#f1f5f9', color: '#64748b', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600}}>{b.id.slice(0, 8).toUpperCase()}</span></td>
                          <td style={{ padding: '16px 12px', color: '#64748b', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{new Date(b.created_at).toLocaleString()}</td>
                          <td style={{ padding: '16px 12px', color: 'var(--navy-dark)', fontSize: '0.9rem', fontWeight: '500', whiteSpace: 'nowrap' }}>{b.dtc_location}</td>
                          <td style={{ padding: '16px 12px', color: 'var(--navy-dark)', fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap' }}>{b.event_name}</td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{b.first_name} {b.last_name}</td>
                          <td style={{ padding: '16px 12px', color: '#64748b', fontSize: '0.85rem' }}>{b.email}</td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{b.phone_number || '-'}</td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{b.room_type || '-'}</td>
                          <td style={{ padding: '16px 12px', color: '#64748b', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{new Date(b.start_time).toLocaleString()}</td>
                          <td style={{ padding: '16px 12px', color: '#64748b', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{new Date(b.end_time).toLocaleString()}</td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem', textAlign: 'center' }}>{b.participants || '-'}</td>
                          <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.9rem', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={b.notes}>{b.notes || '-'}</td>
                          <td style={{ padding: '16px 12px', color: 'var(--dict-blue)', fontSize: '0.9rem', fontWeight: '500' }}>
                            {b.request_letter_url ? <a href={b.request_letter_url} target="_blank" rel="noreferrer" style={{color: 'inherit', textDecoration: 'underline'}}>View Letter</a> : '-'}
                          </td>
                          <td style={{ padding: '16px 12px' }}>
                            <select 
                              value={b.status || 'Confirmed'} 
                              onChange={(e) => handleStatusChange(b.id, e.target.value)}
                              style={{ 
                                background: b.status === 'Pending' ? '#fef08a' : b.status === 'Cancelled' ? '#fecaca' : '#dcfce7', 
                                color: b.status === 'Pending' ? '#854d0e' : b.status === 'Cancelled' ? '#991b1b' : '#166534', 
                                padding: '4px 8px', 
                                borderRadius: '6px', 
                                fontSize: '0.75rem', 
                                fontWeight: 600,
                                border: '1px solid rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                outline: 'none'
                              }}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Pending">Pending</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => toast('View details clicked')} className="btn-icon" style={{ background: '#f1f5f9', color: '#64748b' }} title="View"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                              <button onClick={() => handleEditItem(b, activeTab)} className="btn-icon" style={{ background: '#f1f5f9', color: '#64748b' }} title="Edit"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg></button>
                              <button onClick={() => handleDelete(b.id)} className="btn-icon danger" title="Delete"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                            </div>
                          </td>
                        </React.Fragment>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Admin Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header-glass">
              <h2 style={{ margin: 0, color: 'var(--navy-dark)', fontSize: '1.8rem', fontWeight: '800' }}>
                {activeTab === 'Featured Rooms' ? (editingId ? 'Edit Featured Room' : 'Add Featured Room') 
                 : activeTab === 'Highlights' ? (editingId ? 'Edit Highlight' : 'Add Highlight') 
                 : activeTab === 'Starlink Installations' ? (editingId ? 'Edit Starlink Reservation' : 'Add Starlink Reservation') 
                 : (editingId ? 'Edit Room Reservation' : 'Add Room Reservation')}
              </h2>
              <button className="btn-icon" onClick={() => { setIsModalOpen(false); setEditingId(null); setFormData(initialFormState); }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="form-grid">
              {activeTab === 'Featured Rooms' ? (
                <React.Fragment>
                  <FloatingField formData={formData} setFormData={setFormData} label="Location" name="location" options={[adminLocation]} disabled={true} width="100%" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Room Title" name="title" width="100%" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Room Image File" name="image_file" type="file" width="100%" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Badge Text" name="badge_text" width="1" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Badge Color HEX" name="badge_style" placeholder="#2ecc71" width="1" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Max Pax" name="max_pax" type="number" width="1" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Chairs" name="chairs" type="number" width="1" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Tables" name="tables" type="number" width="1" />
                  <FloatingField formData={formData} setFormData={setFormData} label="PCs" name="pcs" type="number" width="1" />
                </React.Fragment>
              ) : activeTab === 'Highlights' ? (
                <React.Fragment>
                  <FloatingField formData={formData} setFormData={setFormData} label="Month" name="month" placeholder="e.g. OCT" width="1" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Day" name="day" placeholder="21" width="1" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Title" name="title" width="100%" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Image File" name="image_file" type="file" width="100%" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Link (Optional)" name="link_url" placeholder="https://..." width="100%" />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <FloatingField formData={formData} setFormData={setFormData} label="DTC Location" name="dtc_location" options={[adminLocation]} disabled={true} width="1" />
                  {activeTab !== 'Starlink Installations' ? (
                    <FloatingField formData={formData} setFormData={setFormData} label="Room Type" name="room_type" options={['Select a Room', ...dbRooms]} width="1" />
                  ) : <div></div>}
                  
                  <FloatingField formData={formData} setFormData={setFormData} label="Start Time" name="start_time" type="datetime-local" width="1" />
                  <FloatingField formData={formData} setFormData={setFormData} label="End Time" name="end_time" type="datetime-local" width="1" />

                  <FloatingField formData={formData} setFormData={setFormData} label="Event Name" name="event_name" width="100%" />

                  <FloatingField formData={formData} setFormData={setFormData} label="First Name" name="first_name" width="1" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Last Name" name="last_name" width="1" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Email Address" name="email" type="email" width="1" />
                  <FloatingField formData={formData} setFormData={setFormData} label="Phone Number" name="phone" width="1" />

                  {activeTab !== 'Starlink Installations' ? (
                    <FloatingField formData={formData} setFormData={setFormData} label="Participants" name="participants" type="number" width="1" />
                  ) : <div></div>}

                  <FloatingField formData={formData} setFormData={setFormData} label="Notes" name="notes" type="textarea" width="100%" />
                  <div style={{ width: '100%' }}>
                    <FloatingField formData={formData} setFormData={setFormData} label="Attach Request Letter (Optional)" name="request_letter_file" type="file" width="100%" accept=".pdf" />
                    {formData.request_letter_url && (
                      <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                        Current Letter: <a href={formData.request_letter_url} target="_blank" rel="noreferrer" style={{ color: 'var(--dict-blue)', textDecoration: 'underline' }}>View Document</a>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
              <button 
                onClick={() => { setIsModalOpen(false); setEditingId(null); setFormData(initialFormState); }}
                className="btn btn-outline"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : activeTab === 'Featured Rooms' ? (editingId ? 'Update Room' : 'Save Room') 
                 : activeTab === 'Highlights' ? (editingId ? 'Update Highlight' : 'Save Highlight') 
                 : (editingId ? 'Update Reservation' : 'Add Reservation')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
