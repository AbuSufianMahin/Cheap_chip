const { ObjectId } = require("mongodb");
const connectDB = require("../utils/db");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildTimelineFromProduct = (product, fallbackTimestamp) => {
  const timeline = [];

  timeline.push({
    status: "Ordered",
    description: "Order placed successfully",
    timestamp: fallbackTimestamp || product?.createdAt || new Date(),
  });

  if (product?.activity_log) {
    if (product.activity_log.confirmedAt) {
      timeline.push({
        status: "Confirmed",
        description: "Order confirmed by seller",
        timestamp: product.activity_log.confirmedAt,
      });
    }

    if (product.activity_log.processingAt) {
      timeline.push({
        status: "Processing",
        description: "Preparing your order for shipment",
        timestamp: product.activity_log.processingAt,
      });
    }

    if (product.activity_log.assignedAt) {
      timeline.push({
        status: "Shipped",
        description: "Order picked up by delivery partner",
        timestamp: product.activity_log.assignedAt,
      });
    }

    if (product.activity_log.deliveredAt) {
      timeline.push({
        status: "Delivered",
        description: "Order delivered successfully",
        timestamp: product.activity_log.deliveredAt,
      });
    }
  }

  timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return timeline;
};

const normalizeStatus = (status) => {
  const statusMap = {
    active: "ordered",
    assigned: "shipped",
    picked_up: "shipped",
    delivered: "delivered",
    processing: "processing",
    ordered: "ordered",
  };

  return statusMap[status] || status || "ordered";
};

const trackOrder = async (req, res) => {
  try {
    const { db } = await connectDB();
    const { orderId } = req.params;

    // Find order by orderId
    const order = await db.collection("orders").findOne({ orderId });
    let product = null;

    if (order) {
      product = await db.collection("products").findOne({ _id: order.productId });
    }

    // Fallback: support tracking directly by products.trackingId or product _id
    if (!product) {
      const trackingQuery = [{ trackingId: orderId }, { trackingId: String(orderId) }];

      const numericTrackId = Number(orderId);
      if (!Number.isNaN(numericTrackId)) {
        trackingQuery.push({ trackingId: numericTrackId });
      }

      if (ObjectId.isValid(orderId)) {
        trackingQuery.push({ _id: new ObjectId(orderId) });
      }

      product = await db.collection("products").findOne({ $or: trackingQuery });
    }

    if (!product) {
      return res.status(404).json({ message: "Order not found" });
    }

    const timeline = buildTimelineFromProduct(product, order?.createdAt);
    const currentStatus = normalizeStatus(product.current_status);

    const response = {
      orderId: order?.orderId || product.trackingId || orderId,
      productName: product.productName,
      productCategory: product.productCategory,
      productCondition: product.productCondition,
      productPrice: product.productPrice,
      productLocation: product.productLocation,
      status: currentStatus,
      createdAt: order?.createdAt || product.createdAt,
      timeline,
      // Add buyer info
      buyerInfo: order?.buyerInfo || null
    };

    res.json(response);
  } catch (error) {
    console.error("Track order error:", error);
    res.status(500).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { db } = await connectDB();
    const { productId, buyerInfo } = req.body;

    // Validate required fields
    if (!productId || !buyerInfo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const newOrder = {
      orderId,
      productId: new ObjectId(productId),
      buyerInfo,
      createdAt: new Date(),
      status: "ordered"
    };

    const result = await db.collection("orders").insertOne(newOrder);

    res.status(201).json({
      message: "Order created successfully",
      orderId,
      orderId_db: result.insertedId
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { db } = await connectDB();
    const { userId } = req.params;

    const orders = await db.collection("orders").find({ "buyerInfo.userId": userId }).toArray();

    // Get product details for each order
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const product = await db.collection("products").findOne({ _id: order.productId });
        
        // Determine current status
        const currentStatus = normalizeStatus(product?.current_status || "ordered");

        return {
          ...order,
          status: currentStatus,
          product: product ? {
            productName: product.productName,
            productCategory: product.productCategory,
            productImage: product.productImage,
            productPrice: product.productPrice,
            productLocation: product.productLocation
          } : null
        };
      })
    );

    res.json(ordersWithProducts);
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { db } = await connectDB();
    const { orderId } = req.params;
    const { status, description } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Find order
    const order = await db.collection("orders").findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update product status
    const statusMap = {
      ordered: "active",
      processing: "processing",
      shipped: "assigned",
      delivered: "delivered"
    };

    const productStatus = statusMap[status] || status;
    const activityKey = status === "delivered" ? "deliveredAt" : status === "processing" ? "processingAt" : status === "shipped" ? "assignedAt" : "orderedAt";

    await db.collection("products").updateOne(
      { _id: order.productId },
      {
        $set: {
          current_status: productStatus,
          [`activity_log.${activityKey}`]: new Date()
        }
      }
    );

    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: error.message });
  }
};

const supportSearchOrders = async (req, res) => {
  try {
    const { db } = await connectDB();
    const {
      productName = "",
      productCategory = "",
      productCondition = "",
      productId = "",
    } = req.query;

    const trimmedProductId = productId.trim();
    const trimmedName = productName.trim();
    const trimmedCategory = productCategory.trim();
    const trimmedCondition = productCondition.trim();

    if (!trimmedProductId && (!trimmedName || !trimmedCategory || !trimmedCondition)) {
      return res.status(400).json({
        message:
          "Provide productId, or provide productName + productCategory + productCondition.",
      });
    }

    let products = [];

    if (trimmedProductId) {
      if (!ObjectId.isValid(trimmedProductId)) {
        return res.status(400).json({ message: "Invalid productId format" });
      }

      const product = await db
        .collection("products")
        .findOne({ _id: new ObjectId(trimmedProductId) });

      if (product) {
        products = [product];
      }
    } else {
      const query = {
        productName: { $regex: escapeRegex(trimmedName), $options: "i" },
        productCategory: { $regex: `^${escapeRegex(trimmedCategory)}$`, $options: "i" },
        productCondition: { $regex: `^${escapeRegex(trimmedCondition)}$`, $options: "i" },
      };

      products = await db
        .collection("products")
        .find(query)
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();
    }

    const results = await Promise.all(
      products.map(async (product) => {
        const latestOrder = await db
          .collection("orders")
          .find({ productId: product._id })
          .sort({ createdAt: -1 })
          .limit(1)
          .toArray();

        const order = latestOrder[0] || null;

        return {
          productName: product.productName,
          productCategory: product.productCategory,
          productCondition: product.productCondition,
          createdAt: product.createdAt,
          identifiers: {
            productId: product._id.toString(),
            trackingId: product.trackingId || null,
            orderId: order?.orderId || null,
          },
        };
      }),
    );

    return res.status(200).json({
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Support search error:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  trackOrder,
  createOrder,
  getUserOrders,
  updateOrderStatus,
  supportSearchOrders,
};