const dotenv = require("dotenv");
dotenv.config({ path: "./server/.env" });

const connectDB = require("./server/utils/db");
const { ObjectId } = require("mongodb");

async function createSampleData() {
  try {
    const { db } = await connectDB();
    const deliverymen = await db
      .collection("deliveryman-info")
      .find({ isActive: true })
      .project({ _id: 1, name: 1, email: 1 })
      .limit(4)
      .toArray();

    const demoProducts = [
      {
        seedKey: "demo-dhaka-laptop",
        productName: "Lenovo ThinkPad T14 Gen 2",
        productCategory: "Laptop",
        productCondition: "Used - Excellent",
        productPrice: "৳72,000",
        productDescription: "Pickup from Dhanmondi for scheduled delivery.",
        productImage: "",
        productLocation: "House 18, Road 12, Dhanmondi, Dhaka, Bangladesh",
        productContactNumber: "01711000111",
        pickupLocation: {
          address: "House 6, Road 7, Dhanmondi, Dhaka, Bangladesh",
          coordinates: { lat: 23.7465, lng: 90.3742 },
        },
        current_status: "assigned",
        assignedDeliveryman: deliverymen[0]?._id || null,
        buyerInfo: {
          userId: "demo-user-dhaka",
          name: "Arif Hossain",
          email: "arif.hossain@example.com",
          phone: "01811000111",
        },
      },
      {
        seedKey: "demo-chattogram-phone",
        productName: "Samsung Galaxy S23 Ultra",
        productCategory: "Mobile",
        productCondition: "Brand New",
        productPrice: "৳124,500",
        productDescription: "Customer delivery to central Chattogram.",
        productImage: "",
        productLocation: "GEC Circle, Panchlaish, Chattogram, Bangladesh",
        productContactNumber: "01722000222",
        pickupLocation: {
          address: "Agrabad Commercial Area, Chattogram, Bangladesh",
          coordinates: { lat: 22.335, lng: 91.824 },
        },
        current_status: "picked up",
        assignedDeliveryman: deliverymen[1]?._id || deliverymen[0]?._id || null,
        buyerInfo: {
          userId: "demo-user-ctg",
          name: "Nusrat Jahan",
          email: "nusrat.jahan@example.com",
          phone: "01822000222",
        },
      },
      {
        seedKey: "demo-sylhet-headphones",
        productName: "Sony WH-1000XM5",
        productCategory: "Audio",
        productCondition: "Used - Good",
        productPrice: "৳31,000",
        productDescription: "Pickup in Sylhet and deliver to Zindabazar.",
        productImage: "",
        productLocation: "Zindabazar, Sylhet, Bangladesh",
        productContactNumber: "01733000333",
        pickupLocation: {
          address: "Amberkhana, Sylhet, Bangladesh",
          coordinates: { lat: 24.8968, lng: 91.8715 },
        },
        current_status: "assigned",
        assignedDeliveryman: deliverymen[2]?._id || deliverymen[0]?._id || null,
        buyerInfo: {
          userId: "demo-user-sylhet",
          name: "Mahin Ahmed",
          email: "mahin.ahmed@example.com",
          phone: "01833000333",
        },
      },
      {
        seedKey: "demo-khulna-tablet",
        productName: "iPad Air 5",
        productCategory: "Tablet",
        productCondition: "Refurbished",
        productPrice: "৳58,000",
        productDescription: "Route from Khulna warehouse to city delivery point.",
        productImage: "",
        productLocation: "Sonadanga, Khulna, Bangladesh",
        productContactNumber: "01744000444",
        pickupLocation: {
          address: "Khalishpur, Khulna, Bangladesh",
          coordinates: { lat: 22.8382, lng: 89.5604 },
        },
        current_status: "assigned",
        assignedDeliveryman: deliverymen[3]?._id || deliverymen[0]?._id || null,
        buyerInfo: {
          userId: "demo-user-khulna",
          name: "Sadia Rahman",
          email: "sadia.rahman@example.com",
          phone: "01844000444",
        },
      },
    ];

    for (let index = 0; index < demoProducts.length; index += 1) {
      const demoProduct = demoProducts[index];
      const existingProduct = await db.collection("products").findOne({
        demoSeedKey: demoProduct.seedKey,
      });

      const productDocument = {
        productName: demoProduct.productName,
        productCategory: demoProduct.productCategory,
        productCondition: demoProduct.productCondition,
        productPrice: demoProduct.productPrice,
        productDescription: demoProduct.productDescription,
        productImage: demoProduct.productImage,
        productLocation: demoProduct.productLocation,
        productContactNumber: demoProduct.productContactNumber,
        pickupLocation: demoProduct.pickupLocation,
        trackingId: `DEMO-${String(index + 1).padStart(3, "0")}`,
        assignedDeliveryman: demoProduct.assignedDeliveryman,
        assignedTechnician: null,
        technicianDecision: null,
        customerDecision: null,
        evaluatedValue: null,
        warehouseLocation: null,
        customerEmail: demoProduct.buyerInfo.email,
        customerPhone: demoProduct.buyerInfo.phone,
        askingPrice: demoProduct.productPrice,
        current_status: demoProduct.current_status,
        repairLog: [],
        activity_log: {
          createdAt: new Date(),
          assignedAt: new Date(),
          pickedAt: demoProduct.current_status === "picked up" ? new Date() : null,
          deliveredAt: null,
          inspectedAt: null,
          pricedAt: null,
          customerDecidedAt: null,
          finalizedAt: null,
        },
        createdAt: new Date(),
        status: "active",
        demoSeedKey: demoProduct.seedKey,
      };

      let productId = existingProduct?._id;

      if (!existingProduct) {
        const insertedProduct = await db.collection("products").insertOne(productDocument);
        productId = insertedProduct.insertedId;
        console.log(`Demo product created: ${demoProduct.productName}`);
      } else {
        console.log(`Demo product already exists: ${demoProduct.productName}`);
      }

      const orderId = `ORD-DEMO-${String(index + 1).padStart(3, "0")}`;
      const existingOrder = await db.collection("orders").findOne({ orderId });

      if (!existingOrder && productId) {
        await db.collection("orders").insertOne({
          orderId,
          productId,
          buyerInfo: demoProduct.buyerInfo,
          createdAt: new Date(),
          status: demoProduct.current_status === "picked up" ? "shipped" : "ordered",
          demoSeedKey: demoProduct.seedKey,
        });
        console.log(`Demo order created: ${orderId}`);
      } else {
        console.log(`Demo order already exists: ${orderId}`);
      }
    }

    console.log("Demo data created successfully!");
    console.log("Demo orders: ORD-DEMO-001, ORD-DEMO-002, ORD-DEMO-003, ORD-DEMO-004");

  } catch (error) {
    console.error("Error creating sample data:", error);
  } finally {
    process.exit();
  }
}

createSampleData();