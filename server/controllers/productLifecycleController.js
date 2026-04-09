const { ObjectId } = require("mongodb");
const connectDB = require("../utils/db");

const createProduct = async (req, res) => {
  try {
    const db = await connectDB();
    const {
      productName,
      productCategory,
      productCondition,
      productPriceRange,
      productDescription,
      productImage,
      productLocation,
      productContactNumber,
    } = req.body;

    // Validate required fields
    if (!productName || !productCategory || !productCondition || !productPriceRange || !productDescription || !productImage || !productLocation || !productContactNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = {
      productName,
      productCategory,
      productCondition,
      productPriceRange,
      productDescription,
      productImage,
      productLocation,
      productContactNumber,
      createdAt: new Date(),
      status: 'active'
    };

    const result = await db.collection("products").insertOne(newProduct);

    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertedId
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};

const getProductLifecycleByID = async (req, res) => {
  try {
    const db = await connectDB();
    const { productID } = req.params;

    const productInfo = await db
      .collection("products")
      .findOne({ _id: new ObjectId(productID) });

    if (!productInfo) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(productInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductLifeCycleByID = async (req, res) => {
  try {
    const db = await connectDB();
    const { productID } = req.params;
    const { repairLog, ...otherUpdates } = req.body;

    console.log(repairLog)

    const result = await db.collection("products").updateOne({ _id: new ObjectId(productID) },{ $set: otherUpdates, $push: { repairLog: repairLog } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product lifecycle updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createProduct, getProductLifecycleByID, updateProductLifeCycleByID };
