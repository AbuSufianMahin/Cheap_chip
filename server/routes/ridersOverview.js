const express = require("express");
const router = express.Router();
const { getRidersOverview } = require("../controllers/ridersOverviewController");

router.get("/", getRidersOverview);

module.exports = router;