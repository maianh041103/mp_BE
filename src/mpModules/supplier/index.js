const { authenticate } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/authorize");
const {
  indexSuppliersController,
  readSupplierController,
  createSupplierController,
  updateSupplierController,
  deleteSupplierController,
  getTotalDebtController,
  indexPaymentSupplierController
} = require("./supplierController");
const { createValidator } = require("./supplierValidator");

const express = require("express");
const router = new express.Router();

router.get(
  "/",
  authenticate,
  (req, res, next) => {
    req.apiRole = ["supplier_read"];
    next();
  },
  authorize,
  indexSuppliersController
);

router.post(
  "/",
  authenticate,
  (req, res, next) => {
    req.apiRole = "supplier_create";
    next();
  },
  authorize,
  createValidator,
  createSupplierController
);

router.get(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.apiRole = "supplier_update";
    next();
  },
  authorize,
  readSupplierController
);

router.patch(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.apiRole = ["supplier_read", "supplier_update"];
    next();
  },
  authorize,
  createValidator,
  updateSupplierController
);

router.delete(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.apiRole = "supplier_delete";
    next();
  },
  authorize,
  deleteSupplierController
);

router.get("/:id/total-debt", authenticate, (req, res, next) => {
  req.apiRole = "";
  next();
},
  authorize,
  getTotalDebtController
);

router.get(
  "/:supplierId/payment",
  authenticate,
  (req, res, next) => {
    req.apiRole = "";
    next();
  },
  authorize,
  indexPaymentSupplierController
)

module.exports = router;
