const connectDB = require("../utils/db");

const getAllProductInfo = async (req, res) => {
  try {
    const db = await connectDB();
    const onlyUnassigned = req.query.unassigned;

    let dbSearchQuery = {};

    if (onlyUnassigned === "true") {
      dbSearchQuery.assignedDeliveryman = null;
    }

    const products = await db
      .collection("products")
      .find(dbSearchQuery)
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

module.exports = { getAllProductInfo };
