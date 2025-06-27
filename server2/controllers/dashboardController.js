const User = require('../models/User');
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
