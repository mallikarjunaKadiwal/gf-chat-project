import React, { useState } from 'react';
// 1. Import the hook for navigation
import { useNavigate } from 'react-router-dom';
import './App.css'; // We'll reuse the same styles

function Home() {
  const [nameInput, setNameInput] = useState('');
  const navigate = useNavigate(); // 2. Initialize the hook

  // 3. This function now handles saving the name AND navigating
  const handleNameSubmit = (e) => {
    e.preventDefault();
    const trimmedName = nameInput.trim();
    if (trimmedName) {
      localStorage.setItem('chatUserName', trimmedName); // Save to localStorage
      navigate('/chat'); // 4. Navigate to the /chat page
    }
  };

  // This is just the name-entry UI
  return (
    <div className="app-container">
      <div className="name-entry-container">
        <h1>Welcome ❤️</h1>
        <p>What should I call you?</p>
        <form onSubmit={handleNameSubmit} className="chat-input-form">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your name..."
          />
          <button type="submit">Start Chat</button>
        </form>
      </div>
    </div>
  );
}

export default Home;