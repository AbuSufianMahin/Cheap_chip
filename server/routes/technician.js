const express = require("express");
const router = express.Router();

const {
  getAvailableTechnicians,
  assignTechnicianToProduct,
  getAssignedProducts,
  updateTechnicianStatus,
} = require("../controllers/technicianController");

router.get("/available", getAvailableTechnicians);
router.patch("/assign-product", assignTechnicianToProduct);
router.get("/assigned", getAssignedProducts);
router.patch("/status", updateTechnicianStatus);

module.exports = router;
