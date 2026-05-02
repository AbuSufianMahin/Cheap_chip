const dotenv = require("dotenv");
dotenv.config({ path: "./server/.env" });

const connectDB = require("../utils/db");

const TECHNICIAN_INFO_COLLECTION = "technician-info";

const demoTechnicians = [
  {
    name: "Rafiul Karim",
    email: "rafiul.tech@cheapchip.demo",
    phone: "01710001111",
    location: "Dhanmondi, Dhaka",
    skills: "laptop repair, motherboard diagnostics",
    certificates: "CompTIA A+",
    image: "",
  },
  {
    name: "Tanvir Hasan",
    email: "tanvir.tech@cheapchip.demo",
    phone: "01710002222",
    location: "Panchlaish, Chattogram",
    skills: "mobile repair, soldering",
    certificates: "Mobile Servicing Level-2",
    image: "",
  },
  {
    name: "Sadia Akter",
    email: "sadia.tech@cheapchip.demo",
    phone: "01710003333",
    location: "Zindabazar, Sylhet",
    skills: "data recovery, SSD replacement",
    certificates: "Hardware Troubleshooting Specialist",
    image: "",
  },
  {
    name: "Nafis Rahman",
    email: "nafis.tech@cheapchip.demo",
    phone: "01710004444",
    location: "Sonadanga, Khulna",
    skills: "desktop assembly, PSU diagnostics",
    certificates: "Advanced Electronics Repair",
    image: "",
  },
];

async function seedDemoTechnicians() {
  try {
    const { db, client } = await connectDB();
    const now = new Date();

    for (const technician of demoTechnicians) {
      const normalizedEmail = technician.email.trim().toLowerCase();

      await db.collection(TECHNICIAN_INFO_COLLECTION).updateOne(
        { email: normalizedEmail },
        {
          $set: {
            name: technician.name,
            email: normalizedEmail,
            phone: technician.phone,
            location: technician.location,
            skills: technician.skills,
            certificates: technician.certificates,
            image: technician.image,
            isActive: true,
            updatedAt: now,
          },
          $setOnInsert: {
            currentlyAssigned: [],
            completedRepairs: [],
            stats: {
              totalAssigned: 0,
              totalCompleted: 0,
              totalRejected: 0,
            },
            createdAt: now,
          },
        },
        { upsert: true },
      );

      console.log(`Seeded technician: ${technician.name} (${normalizedEmail})`);
    }

    const seededCount = await db
      .collection(TECHNICIAN_INFO_COLLECTION)
      .countDocuments({ email: { $in: demoTechnicians.map((t) => t.email.toLowerCase()) } });

    console.log(`Done. Demo technicians available in '${TECHNICIAN_INFO_COLLECTION}': ${seededCount}`);

    await client.close();
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed demo technicians:", error);
    process.exit(1);
  }
}

seedDemoTechnicians();
