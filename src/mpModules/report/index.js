const { authenticate } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/authorize");
const {
  getChartProductsReport,
  getRevenuesReport,
} = require("./reportController");
const express = require("express");
const router = new express.Router();

router.get(
  "/product-report",
  authenticate,
  (req, res, next) => {
    req.apiRole = ["product_report_read"];
    next();
  },
  authorize,
  getChartProductsReport
);

router.get(
  "/revenues-report",
  authenticate,
  (req, res, next) => {
    req.apiRole = ["sales_report_read"];
    next();
  },
  authorize,
  getRevenuesReport
);

router.get(
    "/sales-report",
    authenticate,
    (req, res, next) => {
        req.apiRole = ["sales_report_read"];
        next();
    },
    authorize,
    getRevenuesReport
);

module.exports = router;
