const dns = require("dns");
const { MongoClient, ServerApiVersion } = require("mongodb");

// Node's default resolver fails SRV lookup in some networks; allow override via env.
dns.setServers(
  process.env.DNS_SERVERS?.split(",").map((server) => server.trim()) || [
    "8.8.8.8",
    "1.1.1.1",
  ],
);

let client;
let db;

async function connectDB() {
  if (db) {
    return { client, db };
  }

  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set");
    }

    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    try {
      await client.connect();
      console.log("Cheap_chip MongoDB connected");
    } catch (err) {
      console.log("MongoDB connection error:", err);
      throw err;
    }
  }

  const dbName = process.env.DB_NAME;
  if (!dbName) {
    throw new Error("DB_NAME is not set");
  }

  db = client.db(dbName);
  return db;
}

module.exports = connectDB;
