const { ObjectId } = require("mongodb");
const connectDB = require("../utils/db");

const APPLICATION_COLLECTIONS = {
  delivery: "deliverymanApplications",
  technician: "technicianApplications",
};

const ALLOWED_APPLICATION_STATUSES = ["approved", "declined"];

const normalizeApplication = (application, applicationType) => {
  if (!application) {
    return null;
  }

  return {
    id: application._id.toString(),
    applicationType,
    name: application.name,
    email: application.email || null,
    location: application.location,
    mobileNumber: application.mobileNumber,
    drivingLicense: application.drivingLicense || null,
    drivingLicensePicture: application.drivingLicensePicture || null,
    skills: application.skills || null,
    certificates: application.certificates || null,
    certificationPictures: application.certificationPictures || [],
    idProof: application.idProof,
    status: application.status,
    reviewedAt: application.reviewedAt || null,
    reviewedBy: application.reviewedBy || null,
    createdAt: application.createdAt,
  };
};

const getCollectionName = (applicationType) => APPLICATION_COLLECTIONS[applicationType] || null;

const getAdminApplications = async (req, res) => {
  try {
    const db = await connectDB();

    const [deliveryApplications, technicianApplications] = await Promise.all([
      db.collection(APPLICATION_COLLECTIONS.delivery).find({}).toArray(),
      db.collection(APPLICATION_COLLECTIONS.technician).find({}).toArray(),
    ]);

    const applications = [
      ...deliveryApplications.map((application) => normalizeApplication(application, "delivery")),
      ...technicianApplications.map((application) => normalizeApplication(application, "technician")),
    ].sort((firstApplication, secondApplication) => {
      const firstCreatedAt = new Date(firstApplication.createdAt).getTime();
      const secondCreatedAt = new Date(secondApplication.createdAt).getTime();
      return secondCreatedAt - firstCreatedAt;
    });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching admin applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const db = await connectDB();
    const { applicationType, applicationId } = req.params;
    const { status, reviewedBy } = req.body;

    const collectionName = getCollectionName(applicationType);

    if (!collectionName) {
      return res.status(400).json({ message: "Invalid application type" });
    }

    if (!ALLOWED_APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    if (!ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: "Invalid application id" });
    }

    const applicationObjectId = new ObjectId(applicationId);

    const updateResult = await db.collection(collectionName).updateOne(
      { _id: applicationObjectId },
      {
        $set: {
          status,
          reviewedAt: new Date(),
          reviewedBy: reviewedBy || null,
        },
      },
    );

    if (!updateResult.matchedCount) {
      return res.status(404).json({ message: "Application not found" });
    }

    const updatedApplication = await db.collection(collectionName).findOne({ _id: applicationObjectId });

    return res.status(200).json({
      message: "Application status updated successfully",
      application: normalizeApplication(updatedApplication, applicationType),
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAdminApplications,
  updateApplicationStatus,
};