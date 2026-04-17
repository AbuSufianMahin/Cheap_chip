const { ObjectId } = require("mongodb");
const connectDB = require("../utils/db");

const getAvailableDeliverymen = async (req, res) => {
  try {
    const { db } = await connectDB();

    const MAX_ACTIVE_DELIVERIES = 5;

    const query = {
      isActive: true,
      $expr: { $lt: [{ $size: "$currentlyAssigned" }, MAX_ACTIVE_DELIVERIES] },
    };
    
    const availableDeliverymen = await db
      .collection("deliveryman-demo")
      .find(query)
      .toArray();

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
      const deliveryman = await db
        .collection("deliveryman-demo")
        .findOne({ _id: deliverymanObjId, isActive: true }, { session });
      if (!deliveryman) {
        throw Object.assign(new Error("Deliveryman not found or inactive"), {
          status: 404,
        });
      }

      const product = await db
        .collection("products-demo")
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

      await db.collection("deliveryman-demo").updateOne(
        { _id: deliverymanObjId },
        {
          $push: {
            currentlyAssigned: { orderId: productObjId, assignedAt: now },
          },
          $inc: { "stats.totalAssigned": 1 },
        },
        { session },
      );

      await db.collection("products-demo").updateOne(
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
module.exports = { getAvailableDeliverymen, assignDeliverymanToProduct };
