const express = require("express");
const router = express.Router();
const {getAvailableDeliverymen, assignDeliverymanToProduct} = require("../controllers/deliverymenController")

router.get("/available", getAvailableDeliverymen)
router.patch("/assign-product", assignDeliverymanToProduct )

module.exports = router;