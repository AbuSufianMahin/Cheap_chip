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
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!productName) missingFields.push("productName");
    if (!productCategory) missingFields.push("productCategory");
    if (!productCondition) missingFields.push("productCondition");
    if (!productPrice && !productPriceRange)
      missingFields.push("productPrice or productPriceRange");
    if (!productLocation) missingFields.push("productLocation");
    if (!productContactNumber) missingFields.push("productContactNumber");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields: missingFields,
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

      assignedDeliveryman: null,
      assignedTechnician: null,

      technicianDecision: null,
      customerDecision: null,
      evaluatedValue: null,
      warehouseLocation: null,

      pickupLocation: pickupLocation || null,
      customerEmail: customerEmail || null,
      customerPhone: customerPhone || productContactNumber || null,
      askingPrice: askingPrice || productPrice || productPriceRange || null,
      current_status: "ordered",
      repairLog: [],
      activity_log: {
        createdAt: new Date(),
        assignedAt: null,
        pickedAt: null,
        deliveredAt: null,
        inspectedAt: null,
        pricedAt: null,
        customerDecidedAt: null,
        finalizedAt: null,
      },
    };

    const result = await db.collection("products").insertOne(newProduct);

    res.status(201).json({
      message: "Product created successfully",
      productID: result.insertedId,
      success: true,
    });
  } catch (error) {
    console.error("Create product error:", error);
    const statusCode = error.name === "MongoError" ? 500 : 500;
    res.status(statusCode).json({
      error: error.message,
      message: "Failed to create product",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
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
        receivedID: productID,
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
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
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
        receivedID: productID,
      });
    }

    console.log("Updating product:", productID);

    const updateData = {
      $set: {
        ...otherUpdates,
        updatedAt: new Date(),
      },
    };

    if (repairLog) {
      updateData.$push = { repairLog };
    }

    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(productID) }, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found", productID });
    }

    res.json({
      message: "Product lifecycle updated successfully",
      modifiedCount: result.modifiedCount,
      success: true,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      error: error.message,
      message: "Failed to update product",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const estimateRepairTime = async (req, res) => {
  try {
    const { db } = await connectDB();
    const { productId, diagnosis, issueType } = req.body;

    if (!productId || !diagnosis || !issueType) {
      return res.status(400).json({
        message: "Missing required fields: productId, diagnosis, issueType",
      });
    }

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID format",
      });
    }

    // Repair time estimation based on issue type (past data simulation)
    const repairTimeEstimates = {
      screen: { min: 1, max: 2, unit: "days" },
      battery: { min: 1, max: 2, unit: "days" },
      motherboard: { min: 5, max: 10, unit: "days" },
      charging_port: { min: 2, max: 3, unit: "days" },
      software: { min: 1, max: 1, unit: "day" },
      hard_drive: { min: 2, max: 5, unit: "days" },
      water_damage: { min: 7, max: 14, unit: "days" },
      other: { min: 3, max: 7, unit: "days" },
    };

    const estimate = repairTimeEstimates[issueType] || repairTimeEstimates.other;
    const estimatedCompletionDate = new Date();
    estimatedCompletionDate.setDate(
      estimatedCompletionDate.getDate() + Math.ceil((estimate.min + estimate.max) / 2)
    );

    // Save diagnosis and repair estimation to product
    const result = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(productId) },
      {
        $set: {
          repairDiagnosis: diagnosis,
          issueType: issueType,
          estimatedRepairTime: estimate,
          estimatedCompletionDate: estimatedCompletionDate,
          repairStartedAt: new Date(),
          current_status: "processing",
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Repair diagnosis recorded successfully",
      estimatedDays: Math.ceil((estimate.min + estimate.max) / 2),
      estimatedCompletionDate: estimatedCompletionDate.toISOString(),
      estimate: estimate,
      product: result.value,
      success: true,
    });
  } catch (error) {
    console.error("Repair estimation error:", error);
    res.status(500).json({
      error: error.message,
      message: "Failed to estimate repair time",
    });
  }
};

const markProductRepaired = async (req, res) => {
  try {
    const { db } = await connectDB();
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "productId is required",
      });
    }

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID format",
      });
    }

    const result = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(productId) },
      {
        $set: {
          current_status: "repaired",
          repairCompletedAt: new Date(),
          status: "repaired",
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product marked as repaired",
      product: result.value,
      success: true,
    });
  } catch (error) {
    console.error("Mark repaired error:", error);
    res.status(500).json({
      error: error.message,
      message: "Failed to mark product as repaired",
    });
  }
};

const markProductRecycle = async (req, res) => {
  try {
    const { db } = await connectDB();
    const { productId, reason } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "productId is required",
      });
    }

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID format",
      });
    }

    const result = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(productId) },
      {
        $set: {
          current_status: "recycled",
          recycleReason: reason || "Beyond repair",
          recycledAt: new Date(),
          status: "recycled",
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product marked for recycling",
      product: result.value,
      success: true,
    });
  } catch (error) {
    console.error("Mark recycle error:", error);
    res.status(500).json({
      error: error.message,
      message: "Failed to mark product for recycling",
    });
  }
};

module.exports = { 
  createProduct, 
  getProductLifecycleByID, 
  updateProductLifeCycleByID,
  estimateRepairTime,
  markProductRepaired,
  markProductRecycle,
};
