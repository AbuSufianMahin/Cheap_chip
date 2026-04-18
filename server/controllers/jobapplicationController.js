const connectDB = require("../utils/db");

const applyfordeliveryman = async (req, res) => {
  try {
    const { db } = await connectDB();
    const {
      name,
      email,
      location,
      mobileNumber,
      drivingLicense,
      idProof,
      drivingLicensePicture,
    } = req.body;

    // Validate required fields
    if (!name || !email || !location || !mobileNumber || !drivingLicense || !idProof) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const newApplication = {
      name,
      email: normalizedEmail,
      location,
      mobileNumber,
      drivingLicense,
      idProof,
      drivingLicensePicture: drivingLicensePicture || null,
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db.collection("deliverymanApplications").insertOne(newApplication);

    res.status(201).json({
      message: "Delivery man application submitted successfully",
      applicationId: result.insertedId,
    });
  } catch (error) {
    console.error("Error submitting delivery application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const applyfortechnician = async (req, res) => {
  try {
    const { db } = await connectDB();
    const {
      name,
      email,
      location,
      mobileNumber,
      skills,
      certificates,
      idProof,
      certificationPictures,
    } = req.body;

    // Validate required fields
    if (!name || !email || !location || !mobileNumber || !skills || !certificates || !idProof) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const newApplication = {
      name,
      email: normalizedEmail,
      location,
      mobileNumber,
      skills,
      certificates,
      idProof,
      certificationPictures: certificationPictures || [],
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db.collection("technicianApplications").insertOne(newApplication);

    res.status(201).json({
      message: "Technician application submitted successfully",
      applicationId: result.insertedId,
    });
  } catch (error) {
    console.error("Error submitting technician application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  applyfordeliveryman,
  applyfortechnician,
};