import React, { useState, useEffect } from 'react';
import './styles/Navbar.css';
import icon from './images/icon.jpg';
import { Link } from 'react-router-dom';

const Navbar = ({ loggedUser, updateLoggedUser }) => {
  const [menuActive, setMenuActive] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showGreet, setShowGreet] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (windowWidth > 995) {
        setMenuActive(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowWidth]);

  function handleLogout() {
    if (window.confirm('Click OK to Logout')) {
      localStorage.removeItem('loggedUser');
      updateLoggedUser();
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img className="navbar-icon" src={icon} alt="Icon" />
        {(loggedUser && !showGreet) && (
          <p className="greet">Welcome Back,<br/> {loggedUser.split('@')[0]}</p>
        )}
      </div>
      <div className="navbar-right">
        {windowWidth <= 995 && (
          <button
            className="menu-button"
            onClick={() => setMenuActive(!menuActive)} 
          >
            Menu
          </button>
        )}
        <ul className={`navbar-links ${menuActive ? 'active' : ''}`}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/calender">Calendar</Link>
          </li>
          {loggedUser ? (
            <>
              <li>
                <Link to="/mybookings">My Bookings</Link>
              </li>
              <li>
                <Link onClick={handleLogout}>Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/signup">Sign Up</a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
