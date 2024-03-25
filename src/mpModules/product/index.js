const { authenticate } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/authorize");
const {
  indexController,
  indexMasterSaleProductController,
  indexMasterInboundProductController,
  readController,
  createController,
  updateController, 
  deleteController,
  updateStatus,
  deleteProducts,
  indexPriceSettingController,
  updatePriceSettingController,
  updateEndDateProducts,
} = require("./productController");
const {
  createValidator,
  updateStatusValidator,
  updateEndDateValidator,
  updateProductPriceSettingValidator,
} = require("./productValidator");
const express = require("express");
const {getNextValue} = require("./productCodeService");

const router = express.Router();

router.get(
  "/inbound/master",
  authenticate,
  (req, res, next) => {
    req.apiRole = [
      "product_read",
      "order_create",
      "order_update",
      "sales_report_read",
      "discount_read",
      "promotion_read",
    ];
    next();
  },
  authorize,
  indexMasterInboundProductController
);

router.get(
  "/sale/master",
  authenticate,
  (req, res, next) => {
    req.apiRole = [
      "product_read",
      "order_create",
      "order_update",
      "sales_report_read",
      "discount_read",
      "promotion_read",
    ];
    next();
  },
  authorize,
  indexMasterSaleProductController
);

router.get(
  "/",
  authenticate,
  (req, res, next) => {
    req.apiRole = [
      "product_read",
      "order_create",
      "order_update",
      "sales_report_read",
      "discount_read",
      "promotion_read",
    ];
    next();
  },
  authorize,
  indexController
);

router.post(
  "/",
  authenticate,
  (req, res, next) => {
    req.apiRole = "product_create";
    next();
  },
  authorize,
  createValidator,
  createController
);

router.get(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.apiRole = "product_update";
    next();
  },
  authorize,
  readController
);

router.patch(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.apiRole = "product_update";
    next();
  },
  authorize,
  createValidator,
  updateController
);

router.patch(
  "/:id/status",
  authenticate,
  (req, res, next) => {
    req.apiRole = "product_update";
    next();
  },
  authorize,
  updateStatusValidator,
  updateStatus
);

router.delete(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.apiRole = "product_delete";
    next();
  },
  authorize,
  deleteController
);

router.delete(
  "/",
  authenticate,
  (req, res, next) => {
    req.apiRole = "product_delete";
    next();
  },
  authorize,
  deleteProducts
);

// Update endDate many products in Ids
router.patch(
  "/endDate",
  authenticate,
  (req, res, next) => {
    req.apiRole = "product_update";
    next();
  },
  authorize,
  updateEndDateValidator,
  updateEndDateProducts
);

router.get(
  "/price/setting",
  authenticate,
  (req, res, next) => {
    req.apiRole = [
      "product_read",
      "order_create",
      "order_update",
      "sales_report_read",
      "discount_read",
      "promotion_read",
    ];
    next();
  },
  authorize,
  indexPriceSettingController
);

router.patch(
  "/price/setting/:id",
  authenticate,
  (req, res, next) => {
    req.apiRole = "product_update";
    next();
  },
  authorize,
  updateProductPriceSettingValidator,
  updatePriceSettingController
);
module.exports = router;
