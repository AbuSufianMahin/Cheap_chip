const dotenv = require("dotenv");
dotenv.config({ path: "./server/.env" });

const connectDB = require("./server/utils/db");
const { ObjectId } = require("mongodb");

async function createSampleData() {
  try {
    const { db } = await connectDB();

    // Create a sample product first
    const sampleProduct = {
      productName: "Intel Core i7-10700K",
      productCategory: "CPU Chips",
      productCondition: "Brand New",
      productPrice: "৳15,000 - ৳18,000",
      productDescription: "High-performance CPU for gaming and productivity",
      productImage: "",
      productLocation: "Dhaka",
      productContactNumber: "01712345678",
      createdAt: new Date(),
      status: "active",
      current_status: "active",
      repairLog: [],
      activity_log: {}
    };

    const productResult = await db.collection("products").insertOne(sampleProduct);
    console.log("Sample product created:", productResult.insertedId);

    // Create a sample order
    const sampleOrder = {
      orderId: "ORD-TEST123",
      productId: productResult.insertedId,
      buyerInfo: {
        userId: "test-user-123",
        name: "John Doe",
        email: "john@example.com",
        phone: "01812345678"
      },
      createdAt: new Date(),
      status: "ordered"
    };

    const orderResult = await db.collection("orders").insertOne(sampleOrder);
    console.log("Sample order created:", orderResult.insertedId);

    // Update product status
    await db.collection("products").updateOne(
      { _id: productResult.insertedId },
      {
        $set: {
          current_status: "processing",
          "activity_log.processingAt": new Date()
        }
      }
    );

    console.log("Sample data created successfully!");
    console.log("Order ID to test: ORD-TEST123");

  } catch (error) {
    console.error("Error creating sample data:", error);
  } finally {
    process.exit();
  }
}

createSampleData();