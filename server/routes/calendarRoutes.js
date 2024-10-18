const express = require('express');
const router = express.Router();
const { authenticate, updateEvent } = require('../utils/googleCalendar');


router.get('/auth-url', async (req, res) => {
  try {
    const auth = await authenticate();
    const authUrl = auth.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
    });
    res.json({ authUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating auth URL');
  }
});


router.post('/create-event', async (req, res) => {
  try {
    const auth = await authenticate();
    const { summary, location, description, startDateTime, endDateTime } = req.body;

    const event = {
      summary,
      location,
      description,
      start: {
        dateTime: new Date(startDateTime),
        timeZone: 'America/Los_Angeles', 
      },
      end: {
        dateTime: new Date(endDateTime),
        timeZone: 'America/Los_Angeles',
      },
    };

    const link = await updateEvent(auth, 'primary', event);
    res.json(link);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating event');
  }
});

module.exports = router;
