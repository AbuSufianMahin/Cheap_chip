const { ObjectId } = require("mongodb");
const connectDB = require("../utils/db");

const getPlatformOverviewStats = async (req, res) => {
  try {
    const { db } = await connectDB();
    const usersCollection = db.collection("users");
    const productsCollection = db.collection("products");
    const deliverymenCollection = db.collection("deliveryman-info");

    const now = new Date();

    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      totalOrderCount,
      orderCountThisMonth,
      orderCountPrevMonth,
      revenue,
      riderStats,
      deliverySuccessStats,
      orderAndDeliveryTrends,
      userGrowth,
    ] = await Promise.all([
      productsCollection.countDocuments(),
      productsCollection.countDocuments({
        "activity_log.createdAt": {
          $gte: thisMonthStart,
          $lt: thisMonthEnd,
        },
      }),

      productsCollection.countDocuments({
        "activity_log.createdAt": {
          $gte: prevMonthStart,
          $lt: prevMonthEnd,
        },
      }),
      productsCollection
        .aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$askingPrice" },
            },
          },
        ])
        .toArray(),

      deliverymenCollection
        .aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              active: {
                $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
              },
            },
          },
        ])
        .toArray(),

      deliverymenCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalCompleted: { $sum: "$stats.totalCompleted" },
              totalAssigned: { $sum: "$stats.totalAssigned" },
            },
          },
          {
            $project: {
              _id: 0,
              successRate: {
                $cond: [
                  { $eq: ["$totalAssigned", 0] },
                  0,
                  {
                    $round: [
                      {
                        $multiply: [
                          { $divide: ["$totalCompleted", "$totalAssigned"] },
                          100,
                        ],
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        ])
        .toArray(),

      productsCollection
        .aggregate([
          {
            $match: {
              "activity_log.createdAt": { $gte: sixMonthsAgo },
              current_status: { $in: ["ordered", "delivered"] },
            },
          },

          {
            $group: {
              _id: {
                year: { $year: "$activity_log.createdAt" },
                month: { $month: "$activity_log.createdAt" },
              },

              ordered: {
                $sum: {
                  $cond: [{ $eq: ["$current_status", "ordered"] }, 1, 0],
                },
              },

              delivered: {
                $sum: {
                  $cond: [{ $eq: ["$current_status", "delivered"] }, 1, 0],
                },
              },
            },
          },

          {
            $project: {
              _id: 0,
              year: "$_id.year",
              month: "$_id.month",
              ordered: 1,
              delivered: 1,
            },
          },

          { $sort: { year: 1, month: 1 } },
        ])
        .toArray(),

      usersCollection
        .aggregate([
          { $match: { createdAt: { $gte: sixMonthsAgo } } },

          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              users: { $sum: 1 },
            },
          },

          {
            $project: {
              _id: 0,
              year: "$_id.year",
              month: "$_id.month",
              users: 1,
            },
          },

          { $sort: { year: 1, month: 1 } },
        ])
        .toArray(),
    ]);

    let growth = null;
    let direction = null;

    if (orderCountPrevMonth === 0 && orderCountThisMonth === 0) {
      growth = 0;
      direction = "neutral";
    } else if (orderCountPrevMonth === 0) {
      growth = null;
      direction = "neutral";
    } else {
      const raw =
        ((orderCountThisMonth - orderCountPrevMonth) / orderCountPrevMonth) *
        100;
      growth = Math.abs(parseFloat(raw.toFixed(1)));
      direction = raw !== 0 ? (raw > 0 ? "up" : "down") : "neutral";
    }

    const stats = {
      orderCounts: {
        totalOrders: totalOrderCount,
        thisMonth: orderCountThisMonth,
        prevMonth: orderCountPrevMonth,
        growthAmount: growth,
        growthDirection: direction,
      },
      orderAndDeliveryTrends,
      userGrowth,

      revenue: revenue.length > 0 ? revenue[0].total : 0,

      riderCounts: {
        active: riderStats.length > 0 ? riderStats[0].active : 0,
        total: riderStats.length > 0 ? riderStats[0].total : 0,
      },

      deliverySuccessRate:
        deliverySuccessStats.length > 0
          ? deliverySuccessStats[0].successRate
          : 0,
    };

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};
module.exports = { getPlatformOverviewStats };
