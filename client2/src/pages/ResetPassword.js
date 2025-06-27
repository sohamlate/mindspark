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
      const res = await axios.post('http://localhost:3001/api/rootuser/reset-password', {
        token,
        newPassword
      });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage('Invalid or expired token.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-emerald-400 flex items-center justify-center">
      <form
        onSubmit={handleReset}
        className="bg-slate-800 p-8 rounded-lg w-full max-w-md border border-slate-700/50 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 rounded-lg bg-slate-900/50 border border-slate-700/50 focus:outline-none focus:ring focus:ring-emerald-500"
        />

        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition duration-300"
        >
          Reset Password
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-slate-300">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
