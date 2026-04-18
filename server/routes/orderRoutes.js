const express = require("express");
const router = express.Router();
const {
	trackOrder,
	createOrder,
	getUserOrders,
	updateOrderStatus,
	supportSearchOrders,
} = require("../controllers/orderController");

router.post("/create", createOrder);
router.get("/support/search", supportSearchOrders);
router.get("/track/:orderId", trackOrder);
router.get("/user/:userId", getUserOrders);
router.patch("/update/:orderId", updateOrderStatus);

module.exports = router;