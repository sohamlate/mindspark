const User = require('../models/User'); 
const Prescription = require('../models/Prescription');

// Create a new prescription
exports.createPrescription = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, imageUrl } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newPrescription = new Prescription({
      userId: user._id,
      title,
      imageUrl,
    });

    await newPrescription.save();

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
    const { title, imageUrl } = req.body;

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      id,
      { title, imageUrl },
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
    console.log("ddddddd", req.params);
    const { userId } = req.params;
    console.log("userId", userId);
    const prescriptions = await Prescription.find({  });
    console.log("prescriptions", prescriptions);
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ message: 'Error fetching prescriptions' });
  }
};
