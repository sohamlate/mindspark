const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');


router.get('/:userId/prescriptions', prescriptionController.getPrescriptions);

router.post('/:userId/newPrescription', prescriptionController.createPrescription);

router.put('/:id', prescriptionController.editPrescription);

router.delete('/:id', prescriptionController.deletePrescription);

module.exports = router;
