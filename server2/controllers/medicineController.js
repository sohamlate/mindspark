const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medication');

// Create Medicines
exports.createMedicine = async (req, res) => {
  try {
    const { medicines } = req.body;
    const { prescriptionId } = req.params;

    console.log("Received medicines data:", medicines);
    console.log("Type of medicine:", typeof medicines);

    if (!Array.isArray(medicines)) {
      return res.status(400).json({ message: 'Medicines should be an array' });
    }

    for (const medicine of medicines) {
      const { name, dosage, timing, duration } = medicine;
      console.log("Creating medicine:", { name, dosage, timing, duration });

      const newMedicine = new Medicine({
        name,
        dosage,
        timing,
        duration,
        prescriptionId,
      });

      await newMedicine.save();
    }

    res.json({ message: 'Medicines created successfully' });
  } catch (error) {
    console.error('Error creating medicine:', error);
    res.status(500).json({ message: 'Error creating medicine' });
  }
};

// Update a Medicine
exports.updateMedicine = async (req, res) => {
  try {
    const { prescriptionId, medicineId } = req.params;
    const { name, dosage, frequency, duration } = req.body;

    console.log("Updating medicine:", medicineId, "for prescription:", prescriptionId);

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    const medicineIndex = prescription.medicines.findIndex(med => med.id === medicineId);
    if (medicineIndex === -1) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    prescription.medicines[medicineIndex] = { name, dosage, frequency, duration };
    await prescription.save();

    res.json(prescription);
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(500).json({ message: 'Error updating medicine' });
  }
};

// Bulk Update Medicines in a Prescription
exports.updatePrescriptionMedicines = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const { medicines } = req.body;

    console.log("Updating prescription:", prescriptionId);
    console.log("Updated medicines data:", medicines);

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    for (const medicine of medicines) {
      const { _id, name, dosage, frequency, duration, timing } = medicine;

      if (_id) {
        const updatedMedicine = await Medicine.findOneAndUpdate(
          { prescriptionId, _id },
          { name, dosage, frequency, duration, timing },
          { new: true }
        );

        if (!updatedMedicine) {
          return res.status(404).json({ message: 'Medicine not found to update' });
        }

        console.log('Updated medicine:', updatedMedicine);
      } else {
        const newMedicine = new Medicine({
          name,
          dosage,
          frequency,
          duration,
          prescriptionId,
        });

        await newMedicine.save();
        console.log('Added new medicine:', newMedicine);
      }
    }

    const medicineIdsInRequest = medicines.map(med => med._id);
    await Medicine.deleteMany({
      prescriptionId,
      _id: { $nin: medicineIdsInRequest }
    });

    const updatedMedicines = await Medicine.find({ prescriptionId });
    res.json(updatedMedicines);
  } catch (error) {
    console.error('Error updating prescription medicines:', error);
    res.status(500).json({ message: 'Error updating medicines' });
  }
};

// Delete a Medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const { prescriptionId, medicineId } = req.params;
    console.log("Deleting medicine:", medicineId, "from prescription:", prescriptionId);

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    prescription.medicines = prescription.medicines.filter(med => med.id !== medicineId);
    await prescription.save();

    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({ message: 'Error deleting medicine' });
  }
};

// Get All Medicines for a Prescription
exports.getMedicinesByPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const medicines = await Medicine.find({ prescriptionId });

    if (!medicines) {
      return res.status(404).json({ message: 'No medicines found for this prescription' });
    }

    res.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ message: 'Error fetching medicines' });
  }
};
