import React from 'react';
import './styles/Home.css';
import homePageImage from './images/book appoinment.png';
import { Link } from 'react-router-dom';

const HomePage = ({ loggedUser }) => {
  return (
    <div className="home-page">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="image-container">
              <img className="main-img img-fluid w-100" src={homePageImage} alt="Home" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="text-container">
          <h1 className="title">SlotBooker365</h1>
          <p className="description">Experience the future of hassle-free scheduling with our website, SlotBooker365. No more endless emails or phone calls to book appointments. SlotBooker365 offers secure login, intuitive calendar views, and quick slot reservations, helping you manage your time effortlessly. Whether for work or personal needs, SlotBooker365 ensures you never miss a beat. Simplify your scheduling today!</p>
          {
            (loggedUser) 
            ? 
            <Link to='/calender'> <button className='getStartedButton' >Start Booking</button></Link> 
            :
            <Link to='/signup'> <button className='getStartedButton' >Get Started</button></Link> 
          }
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
