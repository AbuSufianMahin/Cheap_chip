const { ObjectId } = require("mongodb");
const connectDB = require("../utils/db");

const trackOrder = async (req, res) => {
  try {
    const db = await connectDB();
    const { orderId } = req.params;

    // Find order by orderId
    const order = await db.collection("orders").findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Get product details
    const product = await db.collection("products").findOne({ _id: order.productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Build timeline from product status and activity log
    const timeline = [];

    // Add order creation
    timeline.push({
      status: "Ordered",
      description: "Order placed successfully",
      timestamp: order.createdAt
    });

    // Add status updates from product
    if (product.activity_log) {
      if (product.activity_log.confirmedAt) {
        timeline.push({
          status: "Confirmed",
          description: "Order confirmed by seller",
          timestamp: product.activity_log.confirmedAt
        });
      }

      if (product.activity_log.processingAt) {
        timeline.push({
          status: "Processing",
          description: "Preparing your order for shipment",
          timestamp: product.activity_log.processingAt
        });
      }

      if (product.activity_log.assignedAt) {
        timeline.push({
          status: "Shipped",
          description: "Order picked up by delivery partner",
          timestamp: product.activity_log.assignedAt
        });
      }

      if (product.activity_log.deliveredAt) {
        timeline.push({
          status: "Delivered",
          description: "Order delivered successfully",
          timestamp: product.activity_log.deliveredAt
        });
      }
    }

    // Determine current status
    let currentStatus = product.current_status || "ordered";
    
    // Map status for display
    const statusMap = {
      active: "ordered",
      assigned: "shipped",
      picked_up: "shipped",
      delivered: "delivered",
      processing: "processing",
      ordered: "ordered"
    };

    currentStatus = statusMap[currentStatus] || currentStatus;

    // Sort timeline by timestamp
    timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const response = {
      orderId: order.orderId,
      productName: product.productName,
      productCategory: product.productCategory,
      productCondition: product.productCondition,
      productPrice: product.productPrice,
      productLocation: product.productLocation,
      status: currentStatus,
      createdAt: order.createdAt,
      timeline,
      // Add buyer info
      buyerInfo: order.buyerInfo
    };

    res.json(response);
  } catch (error) {
    console.error("Track order error:", error);
    res.status(500).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const db = await connectDB();
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
    const db = await connectDB();
    const { userId } = req.params;

    const orders = await db.collection("orders").find({ "buyerInfo.userId": userId }).toArray();

    // Get product details for each order
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const product = await db.collection("products").findOne({ _id: order.productId });
        
        // Determine current status
        let currentStatus = product?.current_status || "ordered";
        const statusMap = {
          active: "ordered",
          assigned: "shipped",
          picked_up: "shipped",
          delivered: "delivered",
          processing: "processing",
          ordered: "ordered"
        };
        currentStatus = statusMap[currentStatus] || currentStatus;

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
    const db = await connectDB();
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

module.exports = { trackOrder, createOrder, getUserOrders, updateOrderStatus };