const { ObjectId } = require("mongodb");
const connectDB = require("../utils/db");

const DELIVERYMEN_INFO_COLLECTION = "deliveryman-info";
const PRODUCTS_COLLECTION = "products";
const DELIVERY_TIME_TARGET = 20;

const ALLOWED_DELIVERY_STATUSES = [
  "on the way",
  "picked up",
  "delivered",
  "in Store house",
];

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

async function findDeliverymanByEmail(db, email, session) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  const fromNewCollection = await db
    .collection(DELIVERYMEN_INFO_COLLECTION)
    .findOne({ email: normalizedEmail }, session ? { session } : undefined);

  if (fromNewCollection) {
    return {
      data: fromNewCollection,
      collectionName: DELIVERYMEN_INFO_COLLECTION,
    };
  }

  const fromLegacyCollection = await db
    .collection(DELIVERYMEN_INFO_COLLECTION)
    .findOne({ email: normalizedEmail }, session ? { session } : undefined);

  if (fromLegacyCollection) {
    return {
      data: fromLegacyCollection,
      collectionName: DELIVERYMEN_INFO_COLLECTION,
    };
  }

  return null;
}

const getAvailableDeliverymen = async (req, res) => {
  try {
    const { db } = await connectDB();

    const MAX_ACTIVE_DELIVERIES = 5;

    const query = {
      isActive: true,
      $expr: { $lt: [{ $size: "$currentlyAssigned" }, MAX_ACTIVE_DELIVERIES] },
    };

    let availableDeliverymen = await db
      .collection(DELIVERYMEN_INFO_COLLECTION)
      .find(query)
      .toArray();

    if (!availableDeliverymen.length) {
      availableDeliverymen = await db
        .collection(DELIVERYMEN_INFO_COLLECTION)
        .find(query)
        .toArray();
    }

    res.status(200).json(availableDeliverymen);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch available deliverymen",
      error: error.message,
    });
  }
};

const assignDeliverymanToProduct = async (req, res) => {
  const { productId, deliverymanId } = req.body;

  if (!productId || !deliverymanId) {
    return res
      .status(400)
      .json({ message: "productId and deliverymanId are required" });
  }

  let session = null;

  try {
    const { db, client } = await connectDB();
    session = client.startSession();

    const productObjId = new ObjectId(productId);
    const deliverymanObjId = new ObjectId(deliverymanId);
    const now = new Date();

    await session.withTransaction(async () => {
      const deliverymanFromNewCollection = await db
        .collection(DELIVERYMEN_INFO_COLLECTION)
        .findOne({ _id: deliverymanObjId, isActive: true }, { session });

      const deliveryCollectionName = deliverymanFromNewCollection
        ? DELIVERYMEN_INFO_COLLECTION
        : DELIVERYMEN_INFO_COLLECTION;

      const deliveryman =
        deliverymanFromNewCollection ||
        (await db
          .collection(DELIVERYMEN_INFO_COLLECTION)
          .findOne({ _id: deliverymanObjId, isActive: true }, { session }));

      if (!deliveryman) {
        throw Object.assign(new Error("Deliveryman not found or inactive"), {
          status: 404,
        });
      }

      const product = await db
        .collection(PRODUCTS_COLLECTION)
        .findOne({ _id: productObjId }, { session });
      if (!product) {
        throw Object.assign(new Error("Product not found"), { status: 404 });
      }
      if (product.assignedDeliveryman) {
        throw Object.assign(
          new Error("Product already has an assigned deliveryman"),
          { status: 409 },
        );
      }

      await db.collection(deliveryCollectionName).updateOne(
        { _id: deliverymanObjId },
        {
          $push: {
            currentlyAssigned: { orderId: productObjId, assignedAt: now },
          },
          $inc: { "stats.totalAssigned": 1 },
        },
        { session },
      );

      await db.collection(PRODUCTS_COLLECTION).updateOne(
        { _id: productObjId },
        {
          $set: {
            assignedDeliveryman: deliverymanObjId,
            current_status: "assigned",
            "activity_log.assignedAt": now,
          },
        },
        { session },
      );
    });

    res.status(200).json({ message: "Rider assigned successfully" });
  } catch (error) {
    console.error("Assign rider error:", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  } finally {
    if (session) await session.endSession();
  }
};

const getAssignedDeliveries = async (req, res) => {
  try {
    const { db } = await connectDB();
    const normalizedEmail = normalizeEmail(req.query.email);
    const activeOnly = req.query.activeOnly === "true";

    if (!normalizedEmail) {
      return res
        .status(400)
        .json({ message: "email query parameter is required" });
    }

    const deliveryman = await findDeliverymanByEmail(db, normalizedEmail);

    if (!deliveryman?.data?._id) {
      return res.status(404).json({ message: "Deliveryman not found" });
    }

    const productQuery = {
      assignedDeliveryman: deliveryman.data._id,
    };

    if (activeOnly) {
      productQuery.current_status = { $ne: "delivered" };
    }

    const assignedDeliveries = await db
      .collection(PRODUCTS_COLLECTION)
      .find(productQuery)
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(assignedDeliveries);
  } catch (error) {
    console.error("Error fetching assigned deliveries:", error);
    return res.status(500).json({
      message: "Failed to fetch assigned deliveries",
      error: error.message,
    });
  }
};

const updateDeliveryStatus = async (req, res) => {
  const { productId, email, status } = req.body;

  if (!productId || !email || !status) {
    return res
      .status(400)
      .json({ message: "productId, email and status are required" });
  }

  if (!ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }

  if (!ALLOWED_DELIVERY_STATUSES.includes(status)) {
    return res.status(400).json({
      message:
        "Invalid status. Allowed values: on the way, picked up, delivered, in Store house",
    });
  }

  let session = null;

  try {
    const { db, client } = await connectDB();
    session = client.startSession();

    const productObjId = new ObjectId(productId);
    const now = new Date();

    await session.withTransaction(async () => {
      const deliveryman = await findDeliverymanByEmail(db, email, session);

      if (!deliveryman?.data?._id) {
        throw Object.assign(new Error("Deliveryman not found"), {
          status: 404,
        });
      }

      const product = await db
        .collection(PRODUCTS_COLLECTION)
        .findOne({ _id: productObjId }, { session });

      if (!product) {
        throw Object.assign(new Error("Product not found"), { status: 404 });
      }

      if (
        !product.assignedDeliveryman ||
        product.assignedDeliveryman.toString() !==
          deliveryman.data._id.toString()
      ) {
        throw Object.assign(new Error("This product is not assigned to you"), {
          status: 403,
        });
      }

      await db.collection(PRODUCTS_COLLECTION).updateOne(
        { _id: productObjId },
        {
          $set: {
            current_status: status,
            deliveryStatusUpdatedAt: now,
            ...(status === "picked up" && { "activity_log.pickedAt": now }),
            ...(status === "delivered" && { "activity_log.deliveredAt": now }),
          },
          $push: {
            deliveryStatusLogs: {
              status,
              updatedBy: deliveryman.data._id,
              updatedAt: now,
            },
          },
        },
        { session },
      );

      if (status === "delivered") {
        const assignedEntry = deliveryman.data.currentlyAssigned.find(
          (entry) => entry.orderId.toString() === productObjId.toString(),
        );

        if (!assignedEntry) {
          throw Object.assign(
            new Error("Order not found in currentlyAssigned"),
            { status: 404 },
          );
        }

        await db.collection(DELIVERYMEN_INFO_COLLECTION).updateOne(
          { _id: new ObjectId(deliveryman.data._id) },
          {
            $pull: {
              currentlyAssigned: { orderId: productObjId },
            },
            $push: {
              completedDeliveries: {
                orderId: productObjId,
                assignedAt: assignedEntry.assignedAt,
                completedAt: now,
              },
            },
            $inc: {
              "stats.totalCompleted": 1,
            },
          },
          { session },
        );
      }
    });

    return res
      .status(200)
      .json({ message: "Delivery status updated successfully" });
  } catch (error) {
    console.error("Update delivery status error:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  } finally {
    if (session) await session.endSession();
  }
};

const getDeliverymenPerformanceOverview = async (req, res) => {
  try {
    const { db } = await connectDB();
    // console.log(db)
    const result = await db
      .collection(DELIVERYMEN_INFO_COLLECTION)
      .aggregate([
        {
          $facet: {
            overview: [
              {
                $group: {
                  _id: null,
                  totalRiders: { $sum: 1 },
                  activeRiders: { $sum: { $cond: ["$isActive", 1, 0] } },
                  totalDeliveries: { $sum: "$stats.totalCompleted" },
                  totalOngoing: { $sum: "$stats.totalAssigned" },
                  totalCancelled: { $sum: "$stats.totalCancelled" },
                  avgDeliveryTime: { $avg: "$stats.averageDeliveryTime" },
                  avgSuccessRate: {
                    $avg: {
                      $cond: [
                        { $gt: ["$stats.totalAssigned", 0] },
                        {
                          $multiply: [
                            {
                              $divide: [
                                "$stats.totalCompleted",
                                "$stats.totalAssigned",
                              ],
                            },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  },
                  avgEfficiencyScore: {
                    $avg: {
                      $let: {
                        vars: {
                          timeScore: {
                            $max: [
                              0,
                              {
                                $subtract: [
                                  100,
                                  {
                                    $multiply: [
                                      {
                                        $divide: [
                                          {
                                            $subtract: [
                                              "$stats.averageDeliveryTime",
                                              DELIVERY_TIME_TARGET,
                                            ],
                                          },
                                          DELIVERY_TIME_TARGET,
                                        ],
                                      },
                                      100,
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                          successScore: {
                            $cond: [
                              { $gt: ["$stats.totalAssigned", 0] },
                              {
                                $multiply: [
                                  {
                                    $divide: [
                                      "$stats.totalCompleted",
                                      "$stats.totalAssigned",
                                    ],
                                  },
                                  100,
                                ],
                              },
                              0,
                            ],
                          },
                        },
                        in: {
                          $add: [
                            { $multiply: ["$$successScore", 0.6] },
                            { $multiply: ["$$timeScore", 0.4] },
                          ],
                        },
                      },
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalRiders: 1,
                  activeRiders: 1,
                  totalOngoing: 1,
                  totalDeliveries: 1,
                  totalCancelled: 1,
                  avgDeliveryTime: { $round: ["$avgDeliveryTime", 0] },
                  avgSuccessRate: { $round: ["$avgSuccessRate", 0] },
                  avgEfficiencyScore: { $round: ["$avgEfficiencyScore", 0] },
                },
              },
            ],
            topDeliverymen: [
              { $sort: { "stats.totalCompleted": -1 } },
              { $limit: 5 },
              {
                $project: {
                  _id: 0,
                  name: 1,
                  email: 1,
                  totalCompleted: "$stats.totalCompleted",
                },
              },
            ],
          },
        },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      data: {
        ...result[0].overview[0],
        topDeliverymen: result[0].topDeliverymen,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDeliverymanStatsByQuery = async (req, res) => {
  try {
    const { db } = await connectDB();
    const { query } = req.params;

    const deliverymen = await db
      .collection(DELIVERYMEN_INFO_COLLECTION)
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      })
      .toArray();

    if (!deliverymen.length) {
      return res.status(404).json({
        success: false,
        message: "No deliveryman found",
      });
    }

    const data = deliverymen.map((deliveryman) => {
      const {
        totalAssigned,
        totalCompleted,
        totalCancelled,
        averageDeliveryTime,
        moneyCollected,
      } = deliveryman.stats;

      const successRate =
        totalAssigned > 0
          ? Math.round((totalCompleted / totalAssigned) * 100)
          : 0;

      const timeScore =
        averageDeliveryTime > 0
          ? Math.max(
              0,
              100 -
                ((averageDeliveryTime - DELIVERY_TIME_TARGET) /
                  DELIVERY_TIME_TARGET) *
                  100,
            )
          : 100;

      const successScore =
        totalAssigned > 0 ? (totalCompleted / totalAssigned) * 100 : 0;

      const efficiencyScore = Math.round(successScore * 0.6 + timeScore * 0.4);

      return {
        _id: deliveryman._id,
        name: deliveryman.name,
        email: deliveryman.email,
        phone: deliveryman.phone,
        isActive: deliveryman.isActive,
        createdAt: deliveryman.createdAt,
        stats: {
          totalAssigned,
          totalCompleted,
          totalCancelled,
          averageDeliveryTime,
          moneyCollected,
          successRate,
          efficiencyScore,
        },
      };
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDeliverymenPerformanceOverview,
  getDeliverymanStatsByQuery,
  getAvailableDeliverymen,
  assignDeliverymanToProduct,
  getAssignedDeliveries,
  updateDeliveryStatus,
};
