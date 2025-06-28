import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [gmail, setGmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); // Step 1: Email+Phone, Step 2: OTP+Password
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://prescriptprob.vercel.app/api/rootuser/request-otp', {
        gmail,
        phone,
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP request failed.');
    }
  };

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://prescriptprob.vercel.app/api/rootuser/verify-otp', {
        gmail,
        phone,
        password,
        otp,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-emerald-400 flex items-center justify-center">
      <form
        onSubmit={step === 1 ? handleRequestOtp : handleVerifyAndSignup}
        className="bg-slate-800 p-8 rounded-lg w-full max-w-md border border-slate-700/50 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

        {message && <p className="text-green-400 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Gmail"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
          required
          disabled={step === 2}
          className="w-full p-3 mb-4 rounded-lg bg-slate-900/50 border border-slate-700/50 focus:outline-none focus:ring focus:ring-emerald-500"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          disabled={step === 2}
          className="w-full p-3 mb-4 rounded-lg bg-slate-900/50 border border-slate-700/50 focus:outline-none focus:ring focus:ring-emerald-500"
        />

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-3 mb-4 rounded-lg bg-slate-900/50 border border-slate-700/50 focus:outline-none focus:ring focus:ring-emerald-500"
            />
            <input
              type="password"
              placeholder="Set Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mb-4 rounded-lg bg-slate-900/50 border border-slate-700/50 focus:outline-none focus:ring focus:ring-emerald-500"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition duration-300"
        >
          {step === 1 ? 'Request OTP' : 'Verify & Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
