import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';
import './styles/SignUp.css'; // Import your CSS file
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);
  const [modelTitle, setModelTitle] = useState();
  const [modelBody, setModelBody] = useState();

  const validateEmail = (email) => {
    // Basic email validation using regular expression
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const generateRandomOTP = () => {
    const generated = Math.floor(100000 + Math.random() * 900000); 
    console.log(generated);
    setGeneratedOtp(generated.toString());
    // Convert the generated OTP to a string
    return generated.toString();
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSendOTP = () => {
    // Handle sending OTP logic (e.g., send email to server and set state to show OTP input)
    if (validateEmail(email)) {
      fetch(`https://oneshot-ai-backend.onrender.com/get-user`)
        .then((response) => response.json())
        .then((data) => {
          let users=data.payload;
          let user=users.find(obj=>obj.email==email)
          console.log(user);
          if (user) {
            setModelTitle("An account with this email already exists");
            setModelBody('you can Login to SlotBooker365 and Start Booking your slots');
            handleShow();
          }
          else{
            const randomOTP = generateRandomOTP();
            emailjs.send('service_rs4ippc', 'template_sraocp6',{
              mail_id: email,
              otp: randomOTP,
            }, 'vBrqMiBI2RrD90Hfx')
            .then((response) => {
              console.log('Email sent successfully:', response.text);
              setShowOtpInput(true);
            })
            .catch((error) => {
              console.error('Email sending failed:', error);
            });
            setShowOtpInput(true);
           }
          })
          .catch((error) => {
            console.error('Error checking account:', error);
          });
    } else {
      setModelTitle("Problem With Email");
      setModelBody("Invalid email address. Please enter a valid email.");
      handleShow();
    }
  };

  const handleVerifyOTP = () => {
    // Handle OTP verification logic (e.g., compare entered OTP with generated OTP)
    if (enteredOtp === generatedOtp) { // Use 'generatedOtp' instead of 'otp'
      setIsOtpVerified(true);
    } else {
      setModelTitle("Problem With OTP");
      setModelBody("Invalid OTP. Please try again.");
      handleShow();
    }
  };

  const handleCreateAccount = () => {
    // Validate that password matches confirm password
    if (password === confirmPassword) {
      // Check if an account with the same email already exists
      fetch(`https://oneshot-ai-backend.onrender.com/get-user`)
        .then((response) => response.json())
        .then((data) => {
          let users=data.payload;
          let user=users.find(obj=>obj.email==email)
          if (user !== undefined) {
            alert('An account with this email already exists.');
          } else {
            // Handle account creation logic
            setAccountCreated(true);
            setModelTitle("Account Created successfully ");
            setModelBody("Now you can Login to SlotBooker365 and Start Booking your slots");
            handleShow();
            // Prepare user data for sending
            const userData = {
              email: email,
              password: password,
            };
  
            // Send user data to the backend using a POST request
            fetch('https://oneshot-ai-backend.onrender.com/post-user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log('User data sent successfully:', data);
              })
              .catch((error) => {
                console.error('Error sending user data:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Error checking account:', error);
        });
    } else {
      setModelTitle("Passwords not matched");
      setModelBody("Both provided passwords are different. Please try again.");
      handleShow();
    }
  };
  


  return (
    <>
     <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{modelTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modelBody}
          </Modal.Body>
          <Modal.Footer>
            {(
              <Button className="book-button" onClick={handleClose}>
                Ok
              </Button>
            )}
          </Modal.Footer>
        </Modal>
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="signup-container">
      <h1>Sign Up</h1>
      {showOtpInput ? (
        isOtpVerified ? (
          <div>
            {accountCreated ? (
              <div>
                <p className="success-message">Account created successfully!</p>
                <button className="go-to-login-button" onClick={() => navigate("/login")}>Go to Login</button>
              </div>
            ) : (
              <div className="password-section">
                <input
                  className='signup-input'
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  className='signup-input'
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button className="create-account-button" onClick={handleCreateAccount}>Create Account</button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <input
              className='signup-input'
              type="text"
              placeholder="OTP"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
            />
            <button className="verify-otp-button" onClick={handleVerifyOTP}>Verify OTP</button>
          </div>
        )
      ) : (
        <div>
          <input
            className='signup-input'
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="send-otp-button" onClick={handleSendOTP}>Send OTP</button>
          <p>Already have an account. 
            <a className='go-to-login' href='/login'>Go to Login</a></p>
        </div>
      )}
      </div>
      </div>
    </div>
    </div>
    </>
  );
}

export default SignUp;
