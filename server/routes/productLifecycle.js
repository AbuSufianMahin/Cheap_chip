const express = require("express");
const router = express.Router();
const { getProductLifecycleByID, updateProductLifeCycleByID } = require("../controllers/productLifecycleController");

router.get("/:productID", getProductLifecycleByID);
router.patch("/:productID", updateProductLifeCycleByID);

module.exports = router;