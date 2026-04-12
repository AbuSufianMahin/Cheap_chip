const express = require("express");
const router = express.Router();
const {
  getAdminApplications,
  updateApplicationStatus,
} = require("../controllers/adminApplicationController");

router.get("/job-applications", getAdminApplications);
router.patch("/job-applications/:applicationType/:applicationId", updateApplicationStatus);

module.exports = router;