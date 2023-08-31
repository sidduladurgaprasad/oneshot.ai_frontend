import React, { useState, useEffect } from 'react';
import './styles/MyBookings.css'; // Import your CSS file

function MyBookings({ loggedUser }) {
  const [bookings, setBookings] = useState([]);
  const timeSlots = [
    '9:30 AM - 10:30 AM',
    '10:30 AM - 11:30 AM',
    '11:30 AM - 12:30 PM',
    '12:30 PM - 1:30 PM',
    '1:30 PM - 2:30 PM',
    '2:30 PM - 3:30 PM',
    // ... Add more time slots as needed
  ];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  useEffect(() => {
    fetch(`https://oneshot-ai-backend.onrender.com/get-booking`)
      .then((response) => response.json())
      .then((data) => {
        const userBookings = data.payload.filter(
          booking => booking.user === loggedUser
        );
        setBookings(userBookings);
      })
      .catch((error) => {
        console.error('Error in getting bookings data:', error);
      });
  }, [loggedUser]);

  const handleDeleteBooking = (bookingId) => {
    console.log(bookingId)
    fetch(`https://oneshot-ai-backend.onrender.com/delete-booking/${bookingId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      // Remove the deleted booking from the state
      setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
      
    })
    .catch(error => {
      console.error('Error in deleting booking:', error);
    });
  };

  return (
    <div className="my-bookings-container">
      {/* <h2>Your Bookings</h2> */}
      {bookings.length === 0 || !loggedUser ? (
        <p>No bookings found.</p>
      ) : (
        <div className="booking-cards">
          {bookings.map((booking) => (
            <div key={booking._id} className="col-xs-12 col-sm-12 col-md-4 col-lg-3">
            <div className="booking-card">
              {/* <h2>Booking Details</h2> */}
              <p><b>Date:</b> {booking.date}-{months[booking.month-1]}-{booking.year}</p>
              <p><b>Slot:</b> {timeSlots[booking.slot-1]}</p>
              <button
                className="delete-button"
                onClick={() => handleDeleteBooking(booking._id)}
              >
                Cancel Booking
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
