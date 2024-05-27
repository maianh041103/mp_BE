const express = require('express');
const router = express.Router();
const { authenticate } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/authorize");
const discountController = require("./discountController");

router.post("/", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, discountController.create);

router.get("/", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, discountController.getAll);

router.put("/:discountId", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, discountController.update);

router.delete("/:discountId", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, discountController.delete);

router.get("/:discountId", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, discountController.getDetail);

module.exports = router;