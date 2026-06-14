export const submitBooking = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isOverlap = false; // Mock overlap logic
      if (isOverlap) {
        resolve({
          success: false,
          error: 'Overlapping booking exists.'
        });
      } else {
        resolve({
          success: true,
          bookingId: `BK-${Math.floor(Math.random() * 10000)}`
        });
      }
    }, 1000);
  });
};

export const fetchAvailability = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'Project Launch',
          start: new Date().toISOString().split('T')[0] + 'T10:00:00',
          end: new Date().toISOString().split('T')[0] + 'T12:00:00',
          extendedProps: {
            organizer: 'Juan',
            location: 'Iligan City',
            type: 'Conference Room',
            status: 'Confirmed'
          }
        },
        {
          id: '2',
          title: 'Team Sync',
          start: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T14:00:00',
          end: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T15:30:00',
          extendedProps: {
            organizer: 'Maria',
            location: 'Iligan City',
            type: 'Training Center',
            status: 'Pending'
          }
        }
      ]);
    }, 500);
  });
};
