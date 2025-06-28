// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://prescriptprob.vercel.app/api/rootuser/login', {
        gmail,
        password
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-emerald-400 flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-lg w-full max-w-md border border-slate-700/50 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="email"
          placeholder="Gmail"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
          required
          className="w-full p-3 mb-4 rounded-lg bg-slate-900/50 border border-slate-700/50 focus:outline-none focus:ring focus:ring-emerald-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 rounded-lg bg-slate-900/50 border border-slate-700/50 focus:outline-none focus:ring focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition duration-300"
        >
          Login
        </button>
        <div className="text-center mt-4">
          <span
            className="text-emerald-300 cursor-pointer hover:underline"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </span>
        </div>
        <p className="text-center mt-4 text-slate-400">
          Don’t have an account?
          <span
            className="text-emerald-300 cursor-pointer hover:underline ml-1"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
