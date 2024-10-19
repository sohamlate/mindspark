
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors'); 

const medicationRoutes = require('./routes/medicationRoutes');
const calendarRoutes = require('./routes/calendarRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(cors());


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const userRoutes = require('./routes/users');
const priscriptionRoutes = require('./routes/prescriptionRoutes');
app.use('/api/users', userRoutes);
app.use('/api/users/:userId', priscriptionRoutes);
app.use('/medications', medicationRoutes);
app.use('/api/calendar', calendarRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
