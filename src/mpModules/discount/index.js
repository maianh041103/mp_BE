const express = require('express');
const router = express.Router();
const { authenticate } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/authorize");
const discountController = require("./discountController");

router.post("/", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, discountController.create);

module.exports = router;