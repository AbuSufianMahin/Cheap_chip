const express = require("express");
const router = express.Router();
const { 
  createProduct, 
  getProductLifecycleByID, 
  updateProductLifeCycleByID,
  estimateRepairTime,
  markProductRepaired,
  markProductRecycle,
} = require("../controllers/productLifecycleController");

router.post("/create", createProduct);
router.post("/estimate-repair", estimateRepairTime);
router.post("/mark-repaired", markProductRepaired);
router.post("/mark-recycle", markProductRecycle);
router.get("/:productID", getProductLifecycleByID);
router.patch("/:productID", updateProductLifeCycleByID);


module.exports = router;