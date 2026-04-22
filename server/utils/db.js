const { MongoClient, ServerApiVersion } = require("mongodb");

let client;
let db;

const resolveDbName = (uri) => {
  if (process.env.DB_NAME) return process.env.DB_NAME;

  try {
    const parsed = new URL(uri);
    const pathname = parsed.pathname?.replace(/^\//, "");
    return pathname || "cheap_chip";
  } catch {
    return "cheap_chip";
  }
};

async function connectDB() {
  if (db) {
    return { db, client } ;
  }

  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      const errorMsg = "MONGODB_URI is not set. Please set MONGODB_URI in .env file. Example: mongodb://127.0.0.1:27017/cheap_chip";
      console.error("✗ " + errorMsg);
      throw new Error(errorMsg);
    }
    const isSrv = uri.startsWith("mongodb+srv://");

    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      tls: isSrv,
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

  db = client.db(resolveDbName(process.env.MONGODB_URI));
  return { db, client };
}

module.exports = connectDB;
