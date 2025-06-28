
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors'); 

const dashboardRoutes = require('./routes/dashboardRoutes');
const calendarRoutes = require('./routes/calendarRoutes'); 
const authRoutes = require('./routes/auth');
// const priscriptionRoutes = require('./routes/prescriptionRoutes');
const llmRoutes = require('./routes/llmRoutes');
const medicinesRoutes = require('./routes/medications');
const rootuser = require('./routes/rootuser');
const priscriptionRoutes = require('./routes/prescriptionRoutes');
const eventRoute = require('./routes/eventRoute');
const userTipsRoute = require('./routes/healthTipsRoutes');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(cors());


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


// app.use('/api/calendar', calendarRoutes);
app.use('/api/user-tips', userTipsRoute);


app.use('/api/dashboard', dashboardRoutes);

app.use('/api/users', rootuser);
// app.use('/api/users', priscriptionRoutes);
app.use('/api/rootuser', authRoutes);
app.use('/api/users/p', priscriptionRoutes);
app.use('/api/extractimg', llmRoutes);
app.use('/api/medicines', medicinesRoutes);
app.use('/api/event' , eventRoute);

app.get("/", (req, res) => {
    return res.json({
      success: true,
      message: "Your server is up and running ..",
    });
  });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
