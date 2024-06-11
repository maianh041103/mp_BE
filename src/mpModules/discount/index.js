const express = require('express');
const router = express.Router();
const { authenticate } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/authorize");
const discountController = require("./discountController");
const discountValidator = require("./discountValidator");

router.post("/", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, discountValidator.createValidator, authorize, discountController.create);

router.get("/", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, discountController.getAll);

router.put("/:discountId", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, discountValidator.createValidator, authorize, discountController.update);

router.delete("/:discountId", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, discountController.delete);

router.get("/:discountId", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, discountController.getDetail);

router.post("/order", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, discountController.getDiscountByOrder);

router.post("/product", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, discountController.getDiscountByProduct);

router.get("/:discountId/order", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, discountController.getDiscountOrderApply);

module.exports = router;