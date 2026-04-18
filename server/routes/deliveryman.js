const express = require("express");
const router = express.Router();
const {
	getAvailableDeliverymen,
	assignDeliverymanToProduct,
	getAssignedDeliveries,
	updateDeliveryStatus,
} = require("../controllers/deliverymenController");

router.get("/available", getAvailableDeliverymen);
router.get("/assigned", getAssignedDeliveries);
router.patch("/assign-product", assignDeliverymanToProduct);
router.patch("/status", updateDeliveryStatus);

module.exports = router;