const { authenticate } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/authorize");
const {
    indexController,
    readController,
    createController,
    updateController,
    updateStatus,
    indexDelete,
    indexDeleteController,
} = require("./saleReturnController");
const { createValidator, updateStatusValidator } = require("./saleReturnValidator");

const express = require("express");
const router = express.Router();

router.post(
    "/",
    authenticate,
    (req, res, next) => {
        req.apiRole = "order_create";
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
        req.apiRole = ["order_read", "order_view_all"];
        next();
    },
    authorize,
    indexController
);

router.get(
    "/:id",
    authenticate,
    (req, res, next) => {
        req.apiRole = "order_read";
        next();
    },
    authorize,
    readController
);

router.patch(
    "/:id/status",
    authenticate,
    (req, res, next) => {
        req.apiRole = "order_update";
        next();
    },
    authorize,
    updateStatus
);

router.delete(
    "/:id",
    authenticate,
    (req, res, next) => {
        req.apiRole = "order_delete";
        next();
    },
    authorize,
    indexDeleteController
);

module.exports = router;