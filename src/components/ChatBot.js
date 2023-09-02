import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/ChatBot.css';

const Chatbot = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      const timeoutId = setTimeout(() => {
        setShowPopup(false);
      }, 6000);
      return () => clearTimeout(timeoutId);
    }
    else{
      setShowPopup(true);
    }
  }, [window.innerWidth]); 

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (event) => {
    setSelectedSlot(event.target.value);
  };

  
  const datePickerComponent = (
    <>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MMMM d, yyyy"
        minDate={new Date()}
        placeholderText="Select a date"
      />
    

    </>
  );

  const slotPickerComponent = (
    <>    
      {/* <p>Please choose a time slot:</p> */}
      <select value={selectedSlot} onChange={handleSlotSelect}>
        <option value="0">Select a time slot</option>
        <option value="1">9:30 AM - 10:30 AM</option>
        <option value="2">10:30 AM - 11:30 AM</option>
        <option value="3">11:30 AM - 12:30 PM</option>
        <option value="4">12:30 PM - 1:30 PM</option>
        <option value="5">1:30 PM - 2:30 PM</option>
        <option value="6">2:30 AM - 3:30 AM</option>
        {/* Add more options for other time slots */}
      </select>
      </>
  );

  useEffect(() => {
    if (showChat) {
     
      setMessages([
        { text: 'Hello! User', sender: 'chatbot' },
        { text: "Welcome to BookEase Bot! I'm here to make your booking experience smooth. Just let me know your preferred date and time, and I'll check availability.", sender: 'chatbot' },
        { text: datePickerComponent, sender: 'chatbot' },
        { text: slotPickerComponent, sender: 'chatbot' }
      ]);
    }
  }, [showChat, selectedDate, selectedSlot]);

  const Reply = (status) => {
    setMessages([...messages, { text: status, sender: 'chatbot' }]);
  };

  function checkAvailability() {
    if (!selectedDate || selectedSlot === '') {
      alert('Please select a date and time slot first.');
      return;
    }
    // Check if there is a booking for the selected date and slot
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth()+1;
    const selectedDay = selectedDate.getDate();
    // Make the fetch request to get the bookings
    // alert(selectedYear+","+selectedMonth+","+selectedDay+","+selectedSlot);
    fetch('https://oneshot-ai-backend.onrender.com/get-booking')
      .then(response => response.json())
      .then(data => {
        const bookings = data.payload;
  
        
        
        const isBooked = bookings.some(booking => {
          // console.log(booking.year , selectedYear);
          // console.log(booking.month , selectedMonth);
          // console.log(booking.date , selectedDay);
          // console.log(booking.slot , parseInt(selectedSlot));
          // alert(booking.year+","+booking.month+","+booking.date+","+booking.slot);
          return (
            booking.year == selectedYear &&
            booking.month == selectedMonth &&
            booking.date == selectedDay &&
            booking.slot == selectedSlot
          );
        });
        
          const newStatus = isBooked
          ? 'This slot is already booked.'
          : 'This slot is available.';
        setAvailabilityStatus(newStatus);
        Reply(newStatus);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        setAvailabilityStatus('An error occurred while fetching bookings.');
      });
  }
  
  

  return (
    <>
      <div className="chatbot-icon" onClick={() => setShowChat(!showChat)}>
      <img src="https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw=" alt="Chatbot Icon" width={"100%"} />
      </div>
      {showChat ? (
        <div className="chat-window">
          <div className="chat-header">
            <h2>BookEase Bot</h2>
            <button onClick={() => setShowChat(false)}>X</button>
          </div>
          <div className="chat-body">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <div className="icon"><img src="https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw=" alt="Chatbot Icon" width={"100%"} /></div>
                <div className="message-content">{message.text}</div>
              </div>
            ))}
          </div>
          <div>
            <button className='check-button' onClick={checkAvailability}>Check Status</button>
          </div>
        </div>
      ):
      (
        showPopup && (
          <div className="popup">
            <p><b>Slot Availability Checker &#128073;</b></p>
          </div>
        )
      )
      }
    </>
  );
};

export default Chatbot;
