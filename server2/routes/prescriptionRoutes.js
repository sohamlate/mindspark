const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');


router.get('/:userId/prescriptions', prescriptionController.getPrescriptions);

router.post('/:userId/newPrescription', prescriptionController.createPrescription);

router.put('/:id', prescriptionController.editPrescription);

router.delete('/:userId/prescriptions/:id', prescriptionController.deletePrescription);

router.get('/:userId/prescriptionStatus', prescriptionController.getPrescriptionStatuses);

module.exports = router;
