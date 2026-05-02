const express = require("express");
const { createRepairRequest, getRepairRequest } = require("../controllers/repairRequestController");
const router = express.Router();

router.post("/", createRepairRequest);
router.get("/", getRepairRequest);

module.exports = router;
