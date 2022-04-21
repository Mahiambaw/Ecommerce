const express = require('express');
const prodcutController = require('../controller/productController')
const authController = require('../controller/authController');
const router = express.Router()

// router.param('id',prodcutController.checkId)

router.route("/top5-cheap").get(prodcutController.alisTopfive, prodcutController.getAllProducts)


router.route("/").get(authController.protect,prodcutController.getAllProducts).post(prodcutController.creatProduct)
router.route("/:id")
.get(prodcutController.getProduct)
.patch(prodcutController.updateProduct)
.delete(authController.protect,
    authController.restrictTo('admin', "product-manager"), 
  prodcutController.deletProduct)

module.exports = router