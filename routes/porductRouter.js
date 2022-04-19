const express = require('express');
const prodcutController = require('../controller/productController')
const fs = require('fs');
const router = express.Router()

// router.param('id',prodcutController.checkId)

router.route("/top5-cheap").get(prodcutController.alisTopfive, prodcutController.getAllProducts)


router.route("/").get(prodcutController.getAllProducts).post(prodcutController.creatProduct)
router.route("/:id").get(prodcutController.getProduct).patch(prodcutController.updateProduct).delete(prodcutController.deletProduct)

module.exports = router