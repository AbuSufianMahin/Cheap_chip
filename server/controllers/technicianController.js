const { ObjectId } = require("mongodb");
const connectDB = require("../utils/db");

const TECHNICIAN_APPLICATIONS_COLLECTION = "technicianApplications";
const TECHNICIAN_INFO_COLLECTION = "technician-info";
const USERS_COLLECTION = "users";
const PRODUCTS_COLLECTION = "products";
const FINAL_TECHNICIAN_STATUSES = ["repaired", "can't be repaired"];

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeTechnicianStatus(status) {
  return typeof status === "string" ? status.trim().toLowerCase() : "";
}

async function getApprovedTechnicianByEmail(db, email, session) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  const fromTechnicianInfoCollection = await db
    .collection(TECHNICIAN_INFO_COLLECTION)
    .findOne(
      {
        email: {
          $regex: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i"),
        },
        isActive: true,
      },
      session ? { session } : undefined,
    );

  if (fromTechnicianInfoCollection) {
    return fromTechnicianInfoCollection;
  }

  const fromUsersCollection = await db.collection(USERS_COLLECTION).findOne(
    {
      email: {
        $regex: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i"),
      },
      role: "technician",
    },
    session ? { session } : undefined,
  );

  if (fromUsersCollection) {
    return fromUsersCollection;
  }

  return db.collection(TECHNICIAN_APPLICATIONS_COLLECTION).findOne(
    {
      email: {
        $regex: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i"),
      },
      status: "approved",
    },
    session ? { session } : undefined,
  );
}

const getAssignedProducts = async (req, res) => {
  try {
    const { db } = await connectDB();
    const normalizedEmail = normalizeEmail(req.query.email);
    const view =
      typeof req.query.view === "string"
        ? req.query.view.trim().toLowerCase()
        : "assigned";

    if (!normalizedEmail) {
      return res
        .status(400)
        .json({ message: "email query parameter is required" });
    }

    const technician = await getApprovedTechnicianByEmail(db, normalizedEmail);

    if (!technician?._id) {
      return res.status(404).json({ message: "Technician not found" });
    }

    const assignmentQuery = {
      $or: [
        { assignedTechnician: technician._id },
        { assignedTechnicianEmail: normalizedEmail },
      ],
    };

    const queryByView = {
      assigned: {
        ...assignmentQuery,
        current_status: { $nin: FINAL_TECHNICIAN_STATUSES },
      },
      all: assignmentQuery,
      completed: {
        ...assignmentQuery,
        current_status: { $in: FINAL_TECHNICIAN_STATUSES },
      },
    };

    const query = queryByView[view] || queryByView.assigned;

    const assignedProducts = await db
      .collection(PRODUCTS_COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(assignedProducts);
  } catch (error) {
    console.error("Error fetching assigned technician products:", error);
    return res.status(500).json({
      message: "Failed to fetch technician products",
      error: error.message,
    });
  }
};

const getAvailableTechnicians = async (req, res) => {
  try {
    const { db } = await connectDB();

    let approvedTechnicians = await db
      .collection(TECHNICIAN_INFO_COLLECTION)
      .find({ isActive: true })
      .project({
        _id: 1,
        name: 1,
        email: 1,
        image: 1,
        phone: 1,
        skills: 1,
        location: 1,
      })
      .toArray();

    if (!approvedTechnicians.length) {
      approvedTechnicians = await db
        .collection(USERS_COLLECTION)
        .find({ role: { $regex: /^technician$/i } })
        .project({
          _id: 1,
          name: 1,
          email: 1,
          image: 1,
          mobileNumber: 1,
          skills: 1,
          location: 1,
        })
        .toArray();
    }

    if (!approvedTechnicians.length) {
      approvedTechnicians = await db
        .collection(TECHNICIAN_APPLICATIONS_COLLECTION)
        .find({ status: "approved" })
        .project({
          _id: 1,
          name: 1,
          email: 1,
          mobileNumber: 1,
          skills: 1,
          location: 1,
        })
        .toArray();
    }

    if (!approvedTechnicians.length) {
      return res.status(200).json([]);
    }

    const technicianIds = approvedTechnicians.map(
      (technician) => technician._id,
    );

    const assignmentCounts = await db
      .collection(PRODUCTS_COLLECTION)
      .aggregate([
        {
          $match: {
            assignedTechnician: { $in: technicianIds },
            current_status: { $nin: FINAL_TECHNICIAN_STATUSES },
          },
        },
        {
          $group: {
            _id: "$assignedTechnician",
            activeAssignments: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const assignmentMap = assignmentCounts.reduce((accumulator, item) => {
      accumulator[item._id.toString()] = item.activeAssignments;
      return accumulator;
    }, {});

    const response = approvedTechnicians.map((technician) => {
      const activeAssignments = assignmentMap[technician._id.toString()] || 0;

      return {
        ...technician,
        activeAssignments,
        mobileNumber: technician.phone || technician.mobileNumber || null,
        skills: technician.skills || null,
        location: technician.location || null,
      };
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching available technicians:", error);
    return res.status(500).json({
      message: "Failed to fetch available technicians",
      error: error.message,
    });
  }
};

const assignTechnicianToProduct = async (req, res) => {
  const { productId, technicianId } = req.body;

  if (!productId || !technicianId) {
    return res
      .status(400)
      .json({ message: "productId and technicianId are required" });
  }

  if (!ObjectId.isValid(productId) || !ObjectId.isValid(technicianId)) {
    return res
      .status(400)
      .json({ message: "Invalid productId or technicianId" });
  }

  let session = null;

  try {
    const { db, client } = await connectDB();
    session = client.startSession();

    const productObjId = new ObjectId(productId);
    const technicianObjId = new ObjectId(technicianId);
    const now = new Date();

    await session.withTransaction(async () => {
      const technicianFromTechnicianInfo = await db
        .collection(TECHNICIAN_INFO_COLLECTION)
        .findOne(
          {
            _id: technicianObjId,
            isActive: true,
          },
          { session },
        );

      const technicianFromUsers = await db.collection(USERS_COLLECTION).findOne(
        {
          _id: technicianObjId,
          role: { $regex: /^technician$/i },
        },
        { session },
      );

      const technician =
        technicianFromTechnicianInfo ||
        technicianFromUsers ||
        (await db.collection(TECHNICIAN_APPLICATIONS_COLLECTION).findOne(
          {
            _id: technicianObjId,
            status: "approved",
          },
          { session },
        ));

      if (!technician) {
        throw Object.assign(new Error("Technician not found or not approved"), {
          status: 404,
        });
      }

      const technicianCollectionName = technicianFromTechnicianInfo
        ? TECHNICIAN_INFO_COLLECTION
        : null;

      const product = await db
        .collection(PRODUCTS_COLLECTION)
        .findOne({ _id: productObjId }, { session });

      if (!product) {
        throw Object.assign(new Error("Product not found"), { status: 404 });
      }

      if (product.assignedTechnician) {
        throw Object.assign(
          new Error("Product already has an assigned technician"),
          { status: 409 },
        );
      }

      await db.collection(PRODUCTS_COLLECTION).updateOne(
        { _id: productObjId },
        {
          $set: {
            assignedTechnician: technicianObjId,
            assignedTechnicianEmail: normalizeEmail(technician.email),
            technicianAssignedAt: now,
          },
          $push: {
            repairLog: {
              action: "technician_assigned",
              technicianId: technicianObjId,
              technicianName: technician.name,
              technicianEmail: normalizeEmail(technician.email),
              updatedAt: now,
            },
          },
        },
        { session },
      );

      if (technicianCollectionName) {
        await db.collection(technicianCollectionName).updateOne(
          { _id: technicianObjId },
          {
            $push: {
              currentlyAssigned: {
                productId: productObjId,
                assignedAt: now,
              },
            },
            $inc: {
              "stats.totalAssigned": 1,
            },
          },
          { session },
        );
      }
    });

    return res
      .status(200)
      .json({ message: "Technician assigned successfully" });
  } catch (error) {
    console.error("Assign technician error:", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  } finally {
    if (session) await session.endSession();
  }
};

const updateTechnicianStatus = async (req, res) => {
  const { productId, email, status, note = "" } = req.body;

  if (!productId || !email || !status) {
    return res
      .status(400)
      .json({ message: "productId, email and status are required" });
  }

  if (!ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }

  const normalizedStatus = normalizeTechnicianStatus(status);

  if (!FINAL_TECHNICIAN_STATUSES.includes(normalizedStatus)) {
    return res.status(400).json({
      message: "Invalid status. Allowed values: repaired, can't be repaired",
    });
  }

  let session = null;

  try {
    const { db, client } = await connectDB();
    session = client.startSession();

    const productObjId = new ObjectId(productId);
    const now = new Date();
    const normalizedEmail = normalizeEmail(email);

    await session.withTransaction(async () => {
      const technician = await getApprovedTechnicianByEmail(
        db,
        normalizedEmail,
        session,
      );

      if (!technician?._id) {
        throw Object.assign(new Error("Technician not found or not approved"), {
          status: 404,
        });
      }

      const product = await db
        .collection(PRODUCTS_COLLECTION)
        .findOne({ _id: productObjId }, { session });

      if (!product) {
        throw Object.assign(new Error("Product not found"), { status: 404 });
      }

      if (
        product.assignedTechnician &&
        product.assignedTechnician.toString() !== technician._id.toString() &&
        product.assignedTechnicianEmail !== normalizedEmail
      ) {
        throw Object.assign(new Error("This product is not assigned to you"), {
          status: 403,
        });
      }

      await db.collection(PRODUCTS_COLLECTION).updateOne(
        { _id: productObjId },
        {
          $set: {
            assignedTechnician: technician._id,
            assignedTechnicianEmail: normalizedEmail,
            technicianDecision: normalizedStatus,
            current_status: normalizedStatus,
            "activity_log.inspectedAt": now,
            technicianStatusUpdatedAt: now,
          },
          $push: {
            repairLog: {
              decision: normalizedStatus,
              note,
              updatedBy: technician._id,
              updatedByEmail: normalizedEmail,
              updatedAt: now,
            },
          },
        },
        { session },
      );

      await db.collection(TECHNICIAN_INFO_COLLECTION).updateOne(
        { email: normalizedEmail, isActive: true },
        {
          $pull: {
            currentlyAssigned: { productId: productObjId },
          },
          $push: {
            completedRepairs: {
              productId: productObjId,
              completedAt: now,
              result: normalizedStatus,
            },
          },
          $inc: {
            "stats.totalCompleted": 1,
            "stats.totalRejected": normalizedStatus === "can't be repaired" ? 1 : 0,
          },
        },
        { session },
      );
    });

    return res
      .status(200)
      .json({ message: "Technician status updated successfully" });
  } catch (error) {
    console.error("Update technician status error:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  } finally {
    if (session) await session.endSession();
  }
};

// const getTechnicianByID = async (req, res) => {
//   try {
//     return res
//       .status(200)
//       .json({ message: "Technician route" });
//   } catch (error) {}
// };

module.exports = {
  getAvailableTechnicians,
  assignTechnicianToProduct,
  getAssignedProducts,
  updateTechnicianStatus,
  // getTechnicianByID,
};
