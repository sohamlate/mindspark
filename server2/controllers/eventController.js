const mongoose = require('mongoose');
const Event = require('../models/Event'); // Ensure this path points to your Event model file
const User = require('../models/User'); // Ensure this path points to your Event model file
const Medication = require('../models/Medication'); // Ensure this path points to your Event model file
const Prescription = require('../models/Prescription'); // Ensure this path points to your Event model file




exports.generateSchedule = async (req, res) => {
  try {
    const { userId, prescriptionId } = req.body;

    const user = await User.findById(userId);
    const medicines = await Medication.find({ prescriptionId });
    // console.log(user, medicines, "printing in generating schedule");

    const events = [];

    medicines.forEach(medicine => {
      const dosageTimes = {
        morning: new Date(), // Start with today’s date
        afternoon: new Date(),
        evening: new Date(),
        night: new Date()
      };

      // Adjust the times based on user settings, 5 minutes prior
      dosageTimes.morning.setHours(user.breakfastTime.getUTCHours(), user.breakfastTime.getUTCMinutes() + 30);
      dosageTimes.afternoon.setHours(user.lunchTime.getUTCHours(), user.lunchTime.getUTCMinutes() + 30);
      dosageTimes.evening.setHours(user.dinnerTime.getUTCHours(), user.dinnerTime.getUTCMinutes() + 30);
      dosageTimes.night.setHours(user.sleepTime.getUTCHours() , user.sleepTime.getUTCMinutes() + 10);

      // console.log(user.breakfastTime);

      Object.entries(medicine.dosage).forEach(([timeOfDay, dose]) => {
        if (dose > 0) {
          const startDateTime = dosageTimes[timeOfDay];

          // Define start and end times for each event (5 minutes before meal time)
          const start = new Date(startDateTime);
          const end = new Date(start.getTime() + 30 * 60 * 1000);  // 30 mins after start
          
          // console.log( start.getHours(), " ", timeOfDay , "  " , dose);

          // Add the event to the events array
          events.push({
            summary: `${medicine.name} Reminder`,
            description: `${medicine.timing} - ${dose} tablet(s) 5 minutes before ${timeOfDay}`,
            start: {
              dateTime: start,
              timeZone: 'Asia/Kolkata'
            },
            end: {
              dateTime: end,
              timeZone: 'Asia/Kolkata'
            },
            recurrence: {
              freq: 'DAILY',
              count: parseInt(medicine.duration, 10)
            }
          });
        }
      });
    });

    const eventDocument = new Event({
      prescriptionId,
      events
    });

    await eventDocument.save();

    res.status(201).json({ message: 'Events generated and saved successfully with today\'s dates.' , eventDocument});
  } catch (err) {
    console.error('Error generating schedule:', err);
    res.status(500).json({ message: 'Error generating schedule' });
  }
};
