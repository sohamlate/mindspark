
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const medicationRoutes = require('./routes/medicationRoutes');
const calendarRoutes = require('./routes/calendarRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


app.use('/medications', medicationRoutes);
app.use('/api/calendar', calendarRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
