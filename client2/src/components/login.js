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
      const response = await axios.post('http://localhost:3001/api/rootuser/login', {
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
    <div className="min-h-screen bg-gray-900 text-yellow-500 flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Gmail"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400">
          Login
        </button>
        <div className="text-center mt-4">
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </span>
        </div>
        <p className="text-center mt-4">
          Don't have an account?
          <span
            className="text-blue-400 cursor-pointer hover:underline ml-1"
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
