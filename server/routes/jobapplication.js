const express = require("express");
const router = express.Router();
const { applyfordeliveryman, applyfortechnician } = require("../controllers/jobapplicationController");

router.post("/delivery", applyfordeliveryman);
router.post("/technician", applyfortechnician);
module.exports = router;