const express = require("express");
const router = express.Router();
const {
	getAvailableDeliverymen,
	assignDeliverymanToProduct,
	getAssignedDeliveries,
	updateDeliveryStatus,
	getAllDeliverymenInfo,
} = require("../controllers/deliverymanController");


// router.get("/", getAllDeliverymenInfo)
router.get("/available", getAvailableDeliverymen);
router.get("/assigned", getAssignedDeliveries);
router.patch("/assign-product", assignDeliverymanToProduct);
router.patch("/status", updateDeliveryStatus);


module.exports = router;