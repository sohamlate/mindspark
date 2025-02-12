const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true }, 
  events: [
    {
      summary: { type: String, required: true }, 
      description: { type: String },
      start: { 
        dateTime: { type: Date, required: true },
        timeZone: { type: String, default: 'Asia/Kolkata' },
      },
      end: { 
        dateTime: { type: Date, required: true },
        timeZone: { type: String, default: 'Asia/Kolkata' },
      },
      recurrence: { 
        freq: { type: String, enum: ['DAILY'], default: 'DAILY' }, 
        count: { type: Number }, 
      }
    }
  ]
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
