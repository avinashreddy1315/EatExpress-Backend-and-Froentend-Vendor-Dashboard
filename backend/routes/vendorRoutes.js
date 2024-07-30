const VendorController = require("../controllers/vendorController")
const express = require('express');
const Vendor = require("../models/vendorModal");
const verifyToken = require("../middlewares/verifyToken")

//Router is an inbult method
const router = express.Router();

/*routes define the endpoints of your web application. they map http requests to the controller 
Methods */

/*as we are posting the data into database so we use .post with endpoint register
    and second parameter as vendorRegistor in vendorController */
router.post("/register", VendorController.vendorRegister);
router.post("/login", VendorController.vendorLogin);
router.get("/all-vendors", VendorController.getAllVendors)
router.get("/single-vendor/:id", VendorController.getVendorById)
router.delete("/:vendorid", VendorController.deleteVendorById)
router.get('/get-vendor', verifyToken,  VendorController.getVendor)
//exporing the router which will export the all the routes under it
module.exports = router;