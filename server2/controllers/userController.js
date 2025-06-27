const User = require('../models/User');
const RootUser = require('../models/rootuser'); // Import RootUser model
const Prescription = require('../models/Prescription');
const Medication = require('../models/Medication');
const Event = require('../models/Event');

exports.getDashboardStats = async (req, res) => {
  try {
    const { rootUserId } = req.body;

    // 1. Get family members (users)
    const users = await User.find({ rootUser: rootUserId });
    const userIds = users.map(u => u._id);

    // 2. Get prescriptions of those users
    const prescriptions = await Prescription.find({ userId: { $in: userIds } });
    const prescriptionIds = prescriptions.map(p => p._id);

    // 3. Count medications and today's events
    const [medicationCount, eventTodayCount] = await Promise.all([
      Medication.countDocuments({ prescriptionId: { $in: prescriptionIds } }),
      Event.aggregate([
        { $match: { prescriptionId: { $in: prescriptionIds } } },
        { $unwind: "$events" },
        {
          $match: {
            "events.start.dateTime": {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              $lte: new Date(new Date().setHours(23, 59, 59, 999))
            }
          }
        },
        { $count: "count" }
      ])
    ]);

    // 4. Return dashboard stats
    res.status(200).json({
      prescriptionCount: prescriptions.length,
      medicationCount,
      eventTodayCount: eventTodayCount[0]?.count || 0,
      familyMemberCount: users.length
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err.message);
    res.status(500).json({ message: 'Error fetching dashboard statistics.' });
  }
};

exports.getUsers = async (req, res) => {
  try {

    // console.log("req: ", req );
   
    const rootUserId = req.body.rootUserId; 
    const users = await User.find({ rootUser: rootUserId }).populate('rootUser');

    return res.status(200).json({  users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSingleUser = async(req, res) => {
  try {
    const userId = req.body.userId; 
    const users = await User.findById(userId);

    return res.status(200).json({  users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.createUser = async (req, res) => {
  try {
    const rootUserId = req.params.rootUserId || req.body.rootUserId;
    
    const rootUser = await RootUser.findById(rootUserId);
    if (!rootUser) {
      return res.status(404).json({ message: 'RootUser not found' });
    }

    // Create a new User with the sleepTime field
    const user = new User({
      name: req.body.name,
      breakfastTime: req.body.breakfastTime,
      lunchTime: req.body.lunchTime,
      dinnerTime: req.body.dinnerTime,
      sleepTime: req.body.sleepTime,  // Include sleepTime here
      rootUser: rootUserId,
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const rootUserId = req.params.rootUserId || req.body.rootUserId;
    if (rootUserId) {
      const rootUser = await RootUser.findById(rootUserId);
      if (!rootUser) {
        return res.status(404).json({ message: 'RootUser not found' });
      }
    }

    // Find the user by ID and update with new data including sleepTime
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
