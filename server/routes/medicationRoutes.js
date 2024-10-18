
const express = require('express');
const router = express.Router();
const Medication = require('../models/medicine');


router.post('/', async (req, res) => {
    const { name, dosage, method, frequency, startDate, endDate } = req.body;

    try {
        const medication = new Medication({ name, dosage, method, frequency, startDate, endDate });
        console.log(medication);
        await medication.save();
        res.status(201).json({ message: 'Medication reminder created successfully.', medication });
    } catch (error) {
        res.status(400).json({ message: 'Could not create reminder.', error });
    }
});


router.get('/', async (req, res) => {
    try {
        const medications = await Medication.find();
        res.status(200).json(medications);
    } catch (error) {
        res.status(500).json({ message: 'Could not retrieve medications.', error });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found.' });
        }
        res.status(200).json(medication);
    } catch (error) {
        res.status(500).json({ message: 'Could not retrieve medication.', error });
    }
});


module.exports = router;
