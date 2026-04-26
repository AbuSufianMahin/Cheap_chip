const express = require("express");
const {
  getAllEmployeeInfo,
  payEmployee,
  onboardEmployee,
  createPaymentIntent,
} = require("../controllers/employeeController");
const router = express.Router();

router.get("/get-all-employee", getAllEmployeeInfo);
router.post("/pay/:employeeID", payEmployee);
router.post("/create-payment-intent", createPaymentIntent);

module.exports = router;
