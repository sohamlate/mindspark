
const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    method: { type: String, required: true },
    frequency: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    // userId: { type: String, required: true } 
});

module.exports = mongoose.model('Medication', MedicationSchema);
