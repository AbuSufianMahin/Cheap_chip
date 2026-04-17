const { MongoClient, ServerApiVersion } = require("mongodb");

let client;
let db;

async function connectDB() {
  if (db) {
    return db;
  }

  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set");
    }
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: false,
      },
      tls: true,
      tlsAllowInvalidCertificates: false,
    });

    try {
      await client.connect();
      console.log("✓ Cheap_chip MongoDB connected");
    } catch (err) {
      console.error("✗ MongoDB connection error:", err.message);
      process.exit(1);
    }
  }

  db = client.db(process.env.DB_NAME);
  return db;
}

module.exports = connectDB;
