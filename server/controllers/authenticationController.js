const { ObjectId } = require("mongodb");
const connectDB = require("../utils/db");
const bcrypt = require("bcrypt");

const registerWithCredentials = async (req, res) => {
  try {
    const db = await connectDB();
    const { name, email, password } = req.body;
    const existingUser = await db.collection("credentials").findOne({ email });

    if (existingUser) {
      if (existingUser.providers?.length === 1 && existingUser.providers[0] === "google") {
        return res.status(409).json({
          code: "ACCOUNT_EXISTS_GOOGLE_ONLY",
          message: "This email is already linked to a Google account.",
        });
      } else {
        return res.status(409).json({
          code: "EMAIL_ALREADY_IN_USE",
          message: "An account with this email already exists.",
        });
      }
    } else {
      const hashedPassword = await bcrypt.hash( password, parseInt(process.env.SALTING_ROUNDS));

      const now = new Date();

      const newUserCredentials = {
        email,
        hashedPassword,
        providers: ["credentials"],
        passwordChangedAt: now,
      };

      const newUserDetails = {
        name,
        email,
        image: process.env.DEFAULT_USER_IMAGE,
        role: "user",
        roleAssignedBy: "system",
        createdAt: now,
        lastLoginAt: null,
      };

      // Create credentials document
      await db
        .collection("credentials")
        .insertOne(newUserCredentials);

      // Create user details document
      const newUserResult = await db
        .collection("users")
        .insertOne(newUserDetails);
      
      const userId = newUserResult.insertedId;

      return res.status(201).json({
        message: "Account created successfully",
        userId
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const linkGoogleWithCredentialsProvider = async (req, res) => {

};

module.exports = { registerWithCredentials, linkGoogleWithCredentialsProvider };
