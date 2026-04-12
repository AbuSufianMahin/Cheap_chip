const express = require("express");
const router = express.Router();
const {getAllProductInfo} = require("../controllers/allProductsController");

router.get("/", getAllProductInfo)

module.exports = router;