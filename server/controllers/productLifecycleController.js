const { ObjectId } = require("mongodb");
const connectDB = require("../utils/db");

const createProduct = async (req, res) => {
  try {
    const { db } = await connectDB();
    const {
      productName,
      productCategory,
      productCondition,
      productPrice,
      productPriceRange,
      productDescription,
      productImage,
      productLocation,
      productContactNumber,
      trackingId,
      pickupLocation,
      customerEmail,
      customerPhone,
      askingPrice,
      activity_log,
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!productName) missingFields.push("productName");
    if (!productCategory) missingFields.push("productCategory");
    if (!productCondition) missingFields.push("productCondition");
    if (!productPrice && !productPriceRange) missingFields.push("productPrice or productPriceRange");
    if (!productLocation) missingFields.push("productLocation");
    if (!productContactNumber) missingFields.push("productContactNumber");

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: "Missing required fields",
        missingFields: missingFields
      });
    }

    const newProduct = {
      productName,
      productCategory,
      productCondition,
      productPrice: productPrice || productPriceRange,
      productPriceRange: productPriceRange || null,
      productDescription: productDescription || "",
      productImage: productImage || "",
      productLocation,
      productContactNumber,
      trackingId: trackingId || null,
      pickupLocation: pickupLocation || null,
      customerEmail: customerEmail || null,
      customerPhone: customerPhone || productContactNumber || null,
      askingPrice: askingPrice || productPrice || productPriceRange || null,
      createdAt: new Date(),
      status: "active",
      current_status: "ordered",
      repairLog: [],
      activity_log: activity_log || {}
    };

    const result = await db.collection("products").insertOne(newProduct);

    res.status(201).json({
      message: "Product created successfully",
      productID: result.insertedId,
      success: true
    });
  } catch (error) {
    console.error("Create product error:", error);
    const statusCode = error.name === 'MongoError' ? 500 : 500;
    res.status(statusCode).json({ 
      error: error.message,
      message: "Failed to create product",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const getProductLifecycleByID = async (req, res) => {
  try {
    const { db } = await connectDB();
    const { productID } = req.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(productID)) {
      return res.status(400).json({ 
        message: "Invalid product ID format",
        receivedID: productID 
      });
    }

    const productInfo = await db
      .collection("products")
      .findOne({ _id: new ObjectId(productID) });

    if (!productInfo) {
      return res.status(404).json({ message: "Product not found", productID });
    }

    res.json(productInfo);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ 
      error: error.message,
      message: "Failed to fetch product",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const updateProductLifeCycleByID = async (req, res) => {
  try {
    const { db } = await connectDB();
    const { productID } = req.params;
    const { repairLog, ...otherUpdates } = req.body;

    // Validate ObjectId format
    if (!ObjectId.isValid(productID)) {
      return res.status(400).json({ 
        message: "Invalid product ID format",
        receivedID: productID 
      });
    }

    console.log("Updating product:", productID);

    const updateData = {
      $set: {
        ...otherUpdates,
        updatedAt: new Date()
      }
    };

    if (repairLog) {
      updateData.$push = { repairLog };
    }

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(productID) },
      updateData
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found", productID });
    }

    res.json({ 
      message: "Product lifecycle updated successfully",
      modifiedCount: result.modifiedCount,
      success: true
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ 
      error: error.message,
      message: "Failed to update product",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = { createProduct, getProductLifecycleByID, updateProductLifeCycleByID };
