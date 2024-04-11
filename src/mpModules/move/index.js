const { authenticate } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/authorize");
const {
    indexController,
    readController,
    createController,
    receiveController,
} = require("./moveController");
const { createValidator, receiveValidator} = require("./moveValidator");

const express = require("express");
const router = express.Router();

router.post(
    "/",
    authenticate,
    (req, res, next) => {
        req.apiRole = "inbound_create";
        next();
    },
    authorize,
    createValidator,
    createController
);

router.get(
    "/",
    authenticate,
    (req, res, next) => {
        req.apiRole = ["inbound_read", "inbound_view_all"];
        next();
    },
    authorize,
    indexController
);

router.get(
    "/:id",
    authenticate,
    (req, res, next) => {
        req.apiRole = "inbound_read";
        next();
    },
    authorize,
    readController
);

router.patch(
  "/:id/receive",
  authenticate,
  (req, res, next) => {
    req.apiRole = "inbound_update";
    next();
  },
    authorize,
    receiveValidator,
    receiveController
);

// router.patch(
//     "/:id/status",
//     authenticate,
//     (req, res, next) => {
//         req.apiRole = "inbound_update";
//         next();
//     },
//     authorize,
//     updateStatusValidator,
//     updateStatus
// );

module.exports = router;
