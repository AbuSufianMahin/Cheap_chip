const express = require("express");
const router = express.Router();
const {
	getAvailableDeliverymen,
	assignDeliverymanToProduct,
	getAssignedDeliveries,
	updateDeliveryStatus,
	getAssignedDeliveryRouteMap,
	getAssignedDeliveryRouteMapImage,
	getDeliverymenPerformanceOverview,
	getDeliverymanStatsByQuery,
	getDeliverymanByID,
} = require("../controllers/deliverymanController");

router.get("/available", getAvailableDeliverymen);
router.get("/assigned", getAssignedDeliveries);
router.get("/route-map", getAssignedDeliveryRouteMap);
router.get("/route-map/image", getAssignedDeliveryRouteMapImage);
router.patch("/assign-product", assignDeliverymanToProduct);
router.patch("/status", updateDeliveryStatus);
router.get("/statistics", getDeliverymenPerformanceOverview);
router.get("/statistics/:query", getDeliverymanStatsByQuery);
router.get("/:deliverymanObjectID", getDeliverymanByID);

module.exports = router;