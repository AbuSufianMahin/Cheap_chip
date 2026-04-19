const express = require("express");
const router = express.Router();
const {
	getAvailableDeliverymen,
	assignDeliverymanToProduct,
	getAssignedDeliveries,
	updateDeliveryStatus,
	getDeliverymenPerformanceOverview,
} = require("../controllers/deliverymanController");


router.get("/statistics", getDeliverymenPerformanceOverview)

router.get("/available", getAvailableDeliverymen);
router.get("/assigned", getAssignedDeliveries);
router.patch("/assign-product", assignDeliverymanToProduct);
router.patch("/status", updateDeliveryStatus);


module.exports = router;