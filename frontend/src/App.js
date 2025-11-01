import React from 'react';
// 1. Import the router components
import { Routes, Route } from 'react-router-dom';
import './App.css';

// 2. Import your "page" components
import Home from './Home';
import Chat from './Chat';

function App() {
  // 3. Define the routes
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;