// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Resume Builder</h1>
      <Link to="/signup" className="mr-4 text-blue-600">Signup</Link>
      <Link to="/login" className="text-blue-600">Login</Link>
    </div>
  );
};

export default Home;