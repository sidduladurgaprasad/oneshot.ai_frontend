import React, { useState , useEffect} from 'react';
import './styles/Calendar.css'; // Import your CSS file

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function Calendar({ loggedUser }) {
  // Function to generate an array of days in a month

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const timeSlots = [
    '9:30 AM - 10:30 AM',
    '10:30 AM - 11:30 AM',
    '11:30 AM - 12:30 PM',
    '12:30 PM - 1:30 PM',
    '1:30 PM - 2:30 PM',
    '2:30 PM - 3:30 PM',
    // ... Add more time slots as needed
  ];

  const backgroundImages = [
    'https://imgeng.jagran.com/images/2021/jan/makar-sankranti1610592586139.jpeg',
    'https://images.meesho.com/images/products/113203157/dpidc_512.webp',
    'https://i.pinimg.com/originals/0e/e5/ff/0ee5ff443e2d8f3e14bc0db77e74ebf8.jpg',
    'https://www.cecinc.com/app/uploads/2019/04/shutterstock_624627599_earth1-600x600.png',
    'https://clipart.world/wp-content/uploads/2020/07/mothers-day.jpg',
    'https://img.freepik.com/premium-vector/logo-happy-father-s-day-silhouette_311314-55.jpg?w=2000',
    'https://i.pinimg.com/736x/e0/16/69/e01669bc11b2f200df40514f5d4ce2e8.jpg',
    'https://img.freepik.com/free-vector/traditional-raksha-bandhan-white-greeting-with-realistic-rakhi-design_1017-33172.jpg',
    'https://img.freepik.com/premium-vector/happy-teachers-day-thank-you-teacher_112255-1420.jpg',
    'https://img.freepik.com/free-vector/happy-dussehra-card-with-lord-rama-raavan-silhouette_1017-33975.jpg?w=2000',
    'https://st5.depositphotos.com/10614052/64930/v/450/depositphotos_649309162-stock-illustration-greeting-card-happy-children-day.jpg',
    'https://img.freepik.com/premium-vector/merry-christmas-ornament-circle-white-paper-greeting-card-design-white-background_383392-615.jpg?w=2000',
  ];
  
  const getDayName = (year, month, day) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = new Date(year, month, day).getDay();
    return daysOfWeek[dayOfWeek];
  };
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [allBookedSlots, setAllBookedSlots] = useState(null);
  const [bookingUpdated, setBookingUpdated] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);


  const handlePrevYear = () => {
    setSelectedYear(prevYear => prevYear - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(prevYear => prevYear + 1);
  };
  useEffect(() => {
    // Set the background image URL based on the selected month
    setBackgroundImage(backgroundImages[selectedMonth]);
    // ... (other useEffect code)
  }, [selectedMonth]);

  useEffect(() => {
    // Set the background image to the current month's background when the component mounts
    setBackgroundImage(backgroundImages[new Date().getMonth()]);
  }, []);
  
  useEffect(() => {
    fetch(`https://oneshot-ai-backend.onrender.com/get-booking`)
      .then((response) => response.json())
      .then((data) => {
        setAllBookedSlots(data.payload);
        console.log(allBookedSlots);
      })
      .catch((error) => {
        console.error('Error in getting booking data:', error);
      });
  }, [bookingUpdated]);


  // Function to check if a date is before the current date
  const isDateDisabled = (year, month, day) => {
    const currentDate = new Date();
    return new Date(year, month, day) < currentDate;
  };

  const [expandedDate, setExpandedDate] = useState(null);

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    setSelectedDate(null);
    setSelectedSlot(null);

    // Set the background image for the selected month
    document.documentElement.style.setProperty('--month-background', backgroundImages[month]);
  };

  const handleDateClick = (date) => {
    setButtonClicked(false);
    if (!isDateDisabled(selectedYear, selectedMonth, date)) {
      if (expandedDate === date) {
        // Toggle the expanded date when clicking again on the same date
        setExpandedDate(null);
      } else {
        setExpandedDate(date);
        handleShow();
      }
      setSelectedDate(date);
      setSelectedSlot(null);
    }
  };
  

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const isSlotBooked = (year, month, date, slot) => {
    if (allBookedSlots !== null) {
      console.log('Checking:', year, month, date, slot);
      return allBookedSlots.some(
        bookedSlot =>
          bookedSlot.year === year &&
          bookedSlot.month === month &&
          bookedSlot.date === date &&
          bookedSlot.slot === slot
      );
    }
    return false; // Return false if allBookedSlots is null
  };
  
  
const isDateFullyBooked = (year, month, date) => {
  if (allBookedSlots !== null) {
    const bookedSlotsForDate = allBookedSlots.filter(
      bookedSlot =>
        bookedSlot.year === year &&
        bookedSlot.month === month &&
        bookedSlot.date === date
    );
    return bookedSlotsForDate.length === timeSlots.length;
  }
  return false; // Return false if allBookedSlots is null
};

const isDatePartiallyBooked = (year, month, date) => {
  if (allBookedSlots !== null) {
    const bookedSlotsForDate = allBookedSlots.filter(
      bookedSlot =>
        bookedSlot.year === year &&
        bookedSlot.month === month &&
        bookedSlot.date === date
    );
    return bookedSlotsForDate.length > 0 && bookedSlotsForDate.length < timeSlots.length;
  }
  return false; // Return false if allBookedSlots is null
};

const getAvailableSlotsCount = (year, month, date) => {
  if (allBookedSlots !== null) {
    const bookedSlotsForDate = allBookedSlots.filter(
      bookedSlot =>
        bookedSlot.year === year &&
        bookedSlot.month === month &&
        bookedSlot.date === date
    );
    return timeSlots.length - bookedSlotsForDate.length;
  }
  return timeSlots.length; // Return maximum available slots if allBookedSlots is null
};

  const handleBooking = () => {
    setButtonClicked(true);
    setBookingSuccess(true);
    if (selectedDate !== null && selectedSlot !== null) {
      const bookingData = {
        user: loggedUser,
        year: selectedYear,
        month: selectedMonth + 1,
        date: selectedDate,
        slot: timeSlots.indexOf(selectedSlot) + 1 // Get the index of the selected slot
      };
  
      fetch(`https://oneshot-ai-backend.onrender.com/post-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })
      .then(response => response.json())
      .then(data => {
        // Update allBookedSlots with the newly booked slot
        setAllBookedSlots(prevBookedSlots => [
          ...prevBookedSlots,
          {
            year: selectedYear,
            month: selectedMonth + 1,
            date: selectedDate,
            slot: timeSlots.indexOf(selectedSlot) + 1
          }
        ]);
        
        setBookingUpdated(true);
        console.log('Booking response:', data);
        // Clear selected slot and date
        setSelectedSlot(null);
        setSelectedDate(null);
        handleClose();
        setBookingSuccess(false);
        
      })
      .catch(error => {
        console.error('Error in booking:', error);
      });
    }
  };
  
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setSelectedDate(null);

  }
  const handleShow = () => setShow(true);

  console.log(allBookedSlots)

  return (
    <>
      <>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Select a Time Slot on {expandedDate}/{selectedMonth + 1}/{selectedYear}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="slot-options">
              {timeSlots.map((slot, index) => (
                <label key={index} className={`slot-option ${isSlotBooked(selectedYear, selectedMonth+1, expandedDate, index+1) ? 'disabled' : ''}`}>
                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot}
                    checked={selectedSlot === slot}
                    onChange={() => handleSlotSelect(slot)}
                    disabled={isSlotBooked(selectedYear, selectedMonth+1, expandedDate, index+1)}
                  />
                  {slot}
                </label>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {selectedSlot !== null && (
              <Button className="book-button" onClick={handleBooking}  disabled={buttonClicked}>
                Book Slot
              </Button>
            )}
          </Modal.Footer>
          {/* Display the booking success message */}
          {bookingSuccess && (
            <div className="booking-success-animation">
              Booking Successful!
            </div>
          )}
        </Modal>
      </>
      {loggedUser ? (
        <div className="calendar-container">
        {/* <div className="calendar-header">
          
        </div> */}
        <div className="row">
          <div className="col-12">
            <img className="month-img" src={backgroundImage} alt="Month" />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="year-selector">
            <button onClick={handlePrevYear}>&lt;</button>
            <p className='year'>{selectedYear}</p>
              {/* <input
                type="number"
                id="year"
                value={selectedYear}
                
                onChange={(e) => setSelectedYear(parseInt(e.target.value)) }
              readonly/> */}
              <button onClick={handleNextYear}>&gt;</button>
            </div>
            <div className="controls">
            {months.map((month, index) => (
                <div
                  key={index}
                  className={`month-cell ${index === selectedMonth ? 'selected' : ''}`}
                  onClick={() => handleMonthClick(index)}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className={`calendar ${expandedDate !== null ? 'expanded' : ''}`}>
              <div className="date-grid">
                {[...Array(getDaysInMonth(selectedYear, selectedMonth)).keys()].map(day => (
                  <div className="date-cell">
                    <div
                      key={day}
                      className={`circle
                        ${day + 1 === selectedDate ? 'selected' : ''}
                        ${isDateDisabled(selectedYear, selectedMonth, day + 1) ? 'disabled' : ''}
                        ${isDateFullyBooked(selectedYear, selectedMonth + 1, day + 1) ? 'fully-booked' : ''}
                        ${isDatePartiallyBooked(selectedYear, selectedMonth + 1, day + 1) && !isDateDisabled(selectedYear, selectedMonth, day + 1) ? 'partially-booked' : ''}
                      `}
                      onClick={() => handleDateClick(day + 1)}
                      data-cannot-book={isDateDisabled(selectedYear, selectedMonth, day + 1)}
                      data-all-booked={isDateFullyBooked(selectedYear, selectedMonth + 1, day + 1)}
                      data-available-slots={getAvailableSlotsCount(selectedYear, selectedMonth + 1, day + 1)}
                    >
                      <span className="day-name">{getDayName(selectedYear, selectedMonth, day + 1)}</span>
                      {day + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      )
      :
      (
        <div>
          Login to access Calendar
        </div>
      )
      }
    </>
    
  );
}

export default Calendar;
