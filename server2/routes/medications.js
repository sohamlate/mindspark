const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');


router.post('/:prescriptionId', medicineController.createMedicine);
router.put('/:prescriptionId/:medicineId', medicineController.updateMedicine);
router.put('/:prescriptionId', medicineController.updatePrescriptionMedicines);
router.delete('/:prescriptionId/:medicineId', medicineController.deleteMedicine);
router.get('/:prescriptionId', medicineController.getMedicinesByPrescription);

module.exports = router;
