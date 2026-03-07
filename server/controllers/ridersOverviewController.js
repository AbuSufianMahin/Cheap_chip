const connectDB = require("../utils/db");

const getRidersOverview = async (req, res) => {
  try {
    const db = await connectDB();
    const riders = await db.collection("ridersInfo").find({}).toArray();

    if (riders.length === 0) {
      return res.json({
        message: "No Riders Found",
      });
    }

    let totalDeliveryDuration = 0;
    let totalAssignedRides = 0;
    let totalCompletedRides = 0;
    let totalCollectedAmount = 0

    riders.forEach((rider) => {
      totalDeliveryDuration += rider.totalDeliveryDuration || 0;
      totalAssignedRides += rider.assignedRideCount || 0;
      totalCompletedRides += rider.completedRideCount || 0;
      totalCollectedAmount += rider.totalCollectedAmount
    });

    const averageTime = totalDeliveryDuration / totalCompletedRides || 0;
    const efficiency = Math.round((totalCompletedRides / totalAssignedRides)*100) || 0;

    res.json({
      averageDeliveryTime: averageTime,
      efficiency: efficiency,
      totalCollectedAmount: totalCollectedAmount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRidersOverview };
