const express = require("express");
const router = express.Router();
const { registerWithCredentials } = require("../controllers/authenticationController");


// router.post("/login", registerWithCredentials)
router.post("/register", registerWithCredentials);

module.exports = router;