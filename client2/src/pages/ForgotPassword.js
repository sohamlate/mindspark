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
    <div className="min-h-screen bg-slate-900 text-emerald-400 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg w-full max-w-md border border-slate-700/50 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your Gmail"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
          required
          className="w-full p-3 mb-4 rounded-lg bg-slate-900/50 border border-slate-700/50 focus:outline-none focus:ring focus:ring-emerald-500"
        />

        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition duration-300"
        >
          Send Reset Link
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-slate-300">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
