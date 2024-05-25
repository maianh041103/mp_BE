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
}, authorize, discountController.update)

module.exports = router;