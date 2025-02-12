const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RootUser = require('../models/rootuser');
const dotenv = require('dotenv');

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

// Logout Controller (handled on frontend)
exports.logout = (req, res) => {
    res.json({ message: 'User logged out.' });
};
