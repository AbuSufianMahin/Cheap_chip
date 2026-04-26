import { MongoClient, ServerApiVersion } from "mongodb";

// Node's default resolver fails SRV lookup in some networks; allow override via env.
import dns from "dns";

dns.setServers(
  process.env.DNS_SERVERS?.split(",").map((server) => server.trim()) || [
    "8.8.8.8",
    "1.1.1.1",
  ],
);

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
    return { db, client };
  }

  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set");
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
      console.log("Cheap_chip MongoDB connected (API)");
    } catch (err) {
      console.log("MongoDB connection error:", err);
      throw err;
    }
  }

  db = client.db(resolveDbName(process.env.MONGODB_URI));
  return { db, client };
}

export default connectDB;
