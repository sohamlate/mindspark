const User = require('../models/User'); 
const Prescription = require('../models/Prescription');
const Medication = require('../models/Medication');

// Create a new prescription
exports.createPrescription = async (req, res) => {
  try {
    const { userId } = req.params;
    const { doctorName, doctorLicense, patientName, patientAge, patientGender, diagnosis, imageUrl, title , _id} = req.body;

    const existingPrescription = await Prescription.findById(_id);

    if (existingPrescription) {
      // If it exists, delete it
      console.log(`Deleting existing prescription with ID: ${_id}`);
      await Prescription.findByIdAndDelete(_id);
    }

    // Create a new prescription
    const newPrescription = new Prescription({
      _id,
      userId,
      doctorName,
      doctorLicense,
      patientName,
      patientAge,
      patientGender,
      diagnosis,
      imageUrl,
      title,
    });

    await newPrescription.save();

    console.log("Presc", newPrescription)

    res.status(201).json(newPrescription);
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ message: 'Error creating prescription' });
  }
};

// Update a prescription
exports.editPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorName, doctorLicense, patientName, patientAge, patientGender, diagnosis, medicines } = req.body;

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      id,
      { doctorName, doctorLicense, patientName, patientAge, patientGender, diagnosis, medicines },
      { new: true }
    );

    if (!updatedPrescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(updatedPrescription);
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ message: 'Error updating prescription' });
  }
};

// Delete a prescription
exports.deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)

    const deletedPrescription = await Prescription.findByIdAndDelete(id);

    if (!deletedPrescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({ message: 'Error deleting prescription' });
  }
};

// Get all prescriptions for a user
exports.getPrescriptions = async (req, res) => {
  try {
    const { userId } = req.params;

    const prescriptions = await Prescription.find({ userId: userId });
    res.json(prescriptions);  
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ message: 'Error fetching prescriptions' });
  }
};



exports.getPrescriptionStatuses = async (req, res) => {
    try {
      console.log('getPrescriptionStatuses called with params:', req.params);
        const userId = req.params.userId;

        // Fetch prescriptions for the user
        const prescriptions = await Prescription.find({ userId }).select('_id date');
        console.log('Fetched prescriptions:', prescriptions);
        const prescriptionIds = prescriptions.map(p => p._id.toString());

        // Fetch all medications under these prescriptions
        const medications = await Medication.find({ prescriptionId: { $in: prescriptionIds } }).select('prescriptionId duration');

        const now = new Date();

        const statuses = prescriptions.map(prescription => {
            const startDate = new Date(prescription.date);
            const meds = medications.filter(m => m.prescriptionId === prescription._id.toString());

            if (meds.length === 0) {
                // No medications, consider as passive
                return { _id: prescription._id.toString(), isActive: false };
            }

            // Compute latest end date based on medication durations
            const medEndDates = meds.map(med => {
                const durationDays = parseInt(med.duration) || 0;
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + durationDays);
                return endDate;
            });

            const latestEndDate = new Date(Math.max(...medEndDates));
            const isActive = now <= latestEndDate;

            return { _id: prescription._id.toString(), isActive };
        });

        console.log('Prescription statuses:', statuses);

        res.status(200).json({ statuses });
    } catch (error) {
        console.error('Error in getPrescriptionStatuses:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

