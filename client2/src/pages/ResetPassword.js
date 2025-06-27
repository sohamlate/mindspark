// src/pages/ResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/rootuser/reset-password', { token, newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage('Invalid or expired token.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-400 flex items-center justify-center">
      <form onSubmit={handleReset} className="bg-gray-800 p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400">
          Reset Password
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
