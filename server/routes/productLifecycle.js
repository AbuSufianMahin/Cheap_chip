const express = require("express");
const router = express.Router();
const { createProduct, getProductLifecycleByID, updateProductLifeCycleByID} = require("../controllers/productLifecycleController");

router.post("/create", createProduct);
router.get("/:productID", getProductLifecycleByID);
router.patch("/:productID", updateProductLifeCycleByID);


module.exports = router;