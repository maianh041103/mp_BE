const express = require("express");
const router = express.Router();
const transactionController = require("./transactionController");
const { authenticate } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/authorize");

router.post("/", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, transactionController.createTransaction);

module.exports = router;
