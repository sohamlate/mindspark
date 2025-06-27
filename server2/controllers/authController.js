const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RootUser = require('../models/rootuser');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

// Signup Controller
exports.signup = async (req, res) => {
    const { gmail, phone, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new RootUser({ gmail, phone, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'User registration failed.' });
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { gmail, password } = req.body;

    try {
        const user = await RootUser.findOne({ gmail });
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

        const token = jwt.sign({ id: user._id, email: gmail }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: 'Login failed.' });
    }
};

// AutoLogin Controller
exports.autoLogin = async (req, res) => {
    try {
        const token = req.body.token;
        if (!token) return res.status(401).json({ success: false, message: "Token not found" });

        const response = jwt.verify(token, process.env.JWT_SECRET);
        if (!response) return res.status(401).json({ success: false, message: "Unauthorized" });

        const email = response.email;
        const user = await RootUser.findOne({ gmail: email.trim() });

        if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

        return res.status(200).json({ success: true, data: user });
    } catch (err) {
        console.error("AutoLogin error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { gmail } = req.body;

    try {
        const user = await RootUser.findOne({ gmail });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = jwt.sign({ id: user._id, gmail }, process.env.JWT_SECRET, { expiresIn: '15m' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetLink = `http://localhost:3000/reset-password/${token}`; // client-side page

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: gmail,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
        });

        res.status(200).json({ message: 'Reset link sent to your email.' });
    } catch (error) {
        console.error("Forgot Password Error:", error.message);
        res.status(500).json({ message: 'Error sending reset email.' });
    }
};

// Reset Password: verify token + update password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await RootUser.findById(decoded.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error("Reset Password Error:", error.message);
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

// Logout Controller (handled on frontend)
exports.logout = (req, res) => {
    res.json({ message: 'User logged out.' });
};
