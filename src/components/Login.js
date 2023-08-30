import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

function Login({ updateLoggedUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex pattern

  const handleLogin = async () => {
    // Reset previous error messages
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    // Validate email and password
    if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    try {
      // Check if the user exists
      const response = await fetch(`https://oneshot-ai-backend.onrender.com/get-user`);
      const userData = await response.json();
      let data = userData.payload;
      let user = data.find(obj => obj.email === email);
      if (user === undefined) {
        setLoginError('User not found');
        return;
      }
      if (user.password === password) {
        updateLoggedUser(user.email);
        localStorage.setItem('loggedUser', user.email);
        navigate("/home");
        console.log('Login successful, navigating to home...');
      } else {
        setLoginError('Invalid password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('An error occurred during login');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-container">
            <h1>Login</h1>
            <input
              className='login-input'
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className='error-message'>{emailError}</div>}
            <input
              className='login-input'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <div className='error-message'>{passwordError}</div>}
            {loginError && <div className='error-message'>{loginError}</div>}
            <button className='loginButton' onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
