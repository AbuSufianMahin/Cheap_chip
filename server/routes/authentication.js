const express = require("express");
const router = express.Router();
const { registerWithCredentials, linkGoogleWithCredentialsProvider } = require("../controllers/authenticationController");

router.post("/register", registerWithCredentials);
router.post("/link-google-and-credentials", linkGoogleWithCredentialsProvider);

module.exports = router;