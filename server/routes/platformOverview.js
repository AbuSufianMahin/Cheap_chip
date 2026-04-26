const express = require("express");
const { getPlatformOverviewStats } = require("../controllers/platformOverview");
const router = express.Router();

router.get("/overview", getPlatformOverviewStats)

module.exports = router;