// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [gmail, setGmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3001/api/rootuser/forgot-password', { gmail });
      setMessage(res.data.message);
    } catch (error) {
      setMessage('Something went wrong. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-yellow flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400">
          Send Reset Link
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
