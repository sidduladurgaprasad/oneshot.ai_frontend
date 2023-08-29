import React, { useState, useEffect } from 'react';
import './styles/MyBookings.css'; // Import your CSS file

function MyBookings({ loggedUser }) {
  const [bookings, setBookings] = useState([]);

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
      <h1>My Bookings</h1>
      {bookings.length === 0 || !loggedUser ? (
        <p>No bookings found.</p>
      ) : (
        <div className="booking-cards">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <h2>Booking Details</h2>
              <p>Date: {booking.date}/{booking.month}/{booking.year}</p>
              <p>Slot: {booking.slot}</p>
              <button
                className="delete-button"
                onClick={() => handleDeleteBooking(booking._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
