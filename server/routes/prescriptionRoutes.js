const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

// Fetch all prescriptions for a user
router.get('/', prescriptionController.getPrescriptions);

// Create a new prescription
router.post('/newPrescription', prescriptionController.createPrescription);

// Edit a specific prescription
router.put('/:id', prescriptionController.editPrescription);

// Delete a specific prescription
router.delete('/:id', prescriptionController.deletePrescription);

module.exports = router;
