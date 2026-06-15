import { supabase } from '../supabaseClient';

export const fetchFeaturedRoomsAPI = async () => {
  try {
    const { data, error } = await supabase.from('featured_rooms').select('*');
    if (error) throw error;
    
    // Transform into grouped format as expected by UI
    const grouped = { 'Iligan City': [], 'Maramag': [], 'Tubod': [] };
    data.forEach(room => {
      if (grouped[room.location]) {
        grouped[room.location].push({
          id: room.id,
          title: room.title,
          img: room.image_url,
          pax: room.max_pax,
          chairs: room.chairs,
          tables: room.tables,
          pcs: room.pcs,
          badge: room.badge_text,
          badgeStyle: room.badge_bg || '#2ecc71'
        });
      }
    });

    return { data: grouped, error: null };
  } catch (error) {
    console.error('API Error (Featured Rooms):', error);
    return { data: null, error };
  }
};

export const fetchHighlightsAPI = async () => {
  try {
    const { data, error } = await supabase.from('highlights').select('*').order('id', { ascending: true });
    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('API Error (Highlights):', error);
    return { data: null, error };
  }
};

export const fetchAvailability = async (type = 'room') => {
  try {
    const viewName = type === 'room' ? 'public_room_reservations' : 'public_starlink_reservations';
    const { data, error } = await supabase.from(viewName).select('*');
    if (error) throw error;

    const formattedData = data.map(booking => ({
      id: booking.id,
      title: booking.event_name,
      start: booking.start_time,
      end: booking.end_time,
      extendedProps: {
        organizer: 'Private',
        location: booking.dtc_location,
        type: type === 'room' ? booking.room_type : 'Starlink',
        status: booking.status || 'Pending'
      }
    }));

    return formattedData;
  } catch (error) {
    console.error('API Error (Availability):', error);
    return [];
  }
};

export const submitBooking = async (data) => {
  try {
    const isRoom = data.type === 'room';
    const nameParts = (data.fullName || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload = {
      dtc_location: data.dtcOffice,
      start_time: new Date(data.checkIn).toISOString(),
      end_time: new Date(data.checkOut).toISOString(),
      event_name: data.eventName,
      first_name: firstName,
      last_name: lastName,
      email: data.email,
      phone_number: data.phone,
      notes: data.notes || '',
    };

    if (data.requestLetterFile) {
      const file = data.requestLetterFile;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('request_letters')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error('Failed to upload request letter: ' + uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('request_letters')
        .getPublicUrl(filePath);
        
      payload.request_letter_url = publicUrl;
    }

    let result;
    if (isRoom) {
      payload.room_type = data.roomType;
      payload.participants = data.participants ? parseInt(data.participants, 10) : null;
      result = await supabase.from('room_reservations').insert([payload]).select();
    } else {
      result = await supabase.from('starlink_reservations').insert([payload]).select();
    }

    if (result.error) throw result.error;

    return { success: true, bookingId: result.data[0].id };
  } catch (error) {
    console.error('API Error (Submit Booking):', error);
    return { success: false, error: error.message };
  }
};

export const searchBookingsAPI = async (query) => {
  try {
    const { data, error } = await supabase.rpc('search_my_bookings', { search_query: query });
    if (error) throw error;
    
    // Format the data to match what ManageBookings expects
    return { 
      data: data.map(booking => ({
        id: booking.id,
        eventName: booking.event_name,
        location: booking.location,
        type: booking.type,
        date: booking.date,
        status: booking.status || 'Pending'
      })), 
      error: null 
    };
  } catch (error) {
    console.error('API Error (Search Bookings):', error);
    return { data: null, error: error.message };
  }
};
