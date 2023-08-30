import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ChatBot.css';

const Chatbot = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (showChat) {
      setMessages([
        { text: 'Welcome!', sender: 'chatbot' },
        { text: 'How can I help you?', sender: 'chatbot' },
      ]);
    }
  }, [showChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
    }
    // Add your own logic to handle the user's message and generate a response from the chatbot
    // For example:
    if (input.trim().toLowerCase() === 'hi') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Hello there!', sender: 'chatbot' },
      ]);
    } else if (input.trim().toLowerCase() === 'show me the buttons') {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: (
            <>
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/signup')}>Signup</button>
              {/* Add more buttons here */}
            </>
          ),
          sender: 'chatbot',
        },
      ]);
    }
    // ...
  };

  return (
    <>
      <div className="chatbot-icon" onClick={() => setShowChat(!showChat)}>
        <img src="https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw=" alt="Chatbot Icon" width={"100%"} />
      </div>
      {showChat && (
        <div className="chat-window">
          <div className="chat-header">
            <h2>Chatbot</h2>
            <button onClick={() => setShowChat(false)}>X</button>
          </div>
          <div className="chat-body">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <div className="icon"></div>
                <div className="message-content">{message.text}</div>
              </div>
            ))}
          </div>
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
