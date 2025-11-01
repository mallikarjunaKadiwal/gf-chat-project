import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Chat() {
  const [userName, setUserName] = useState('');
  
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('chatUserName');
    if (storedName) {
      setUserName(storedName);
      setMessages([
        { role: 'model', text: `Hey ${storedName}, my love. I'm right here with you. What's on your mind?` }
      ]);
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = currentMessage.trim();
    if (text === '') return;

    const newUserMessage = { role: 'user', text: text };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    const historyPayload = messages.map(msg => ({
      role: msg.role,
      text: msg.text
    }));

    try {
      const response = await fetch('https://my-chat-backend.onrender.com/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: historyPayload,
          message: text,
          userName: userName
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const aiResponse = { role: 'model', text: data.reply };
      setMessages(prevMessages => [...prevMessages, aiResponse]);

    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prevMessages => [...prevMessages, {
        role: 'model', text: "I'm sorry, my love. I'm having a little trouble connecting right now."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userName) {
    return null; 
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>GF ❤️</h1>
      </header>
      
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message model">
            <p>GF is typing...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder={`Talk to me, ${userName}...`}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
