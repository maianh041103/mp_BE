const { authenticate } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/authorize");
const {
  getList,
  getDetail,
  create,
  update,
  deleteController,
} = require("./bannerController");
const { createValidator } = require("./bannerValidator");

const express = require("express");

const router = new express.Router();

router.get(
  "/",
  authenticate,
  (req, res, next) => {
    req.apiRole = ["banner_read"];
    next();
  },
  authorize,
  getList
);

router.post(
  "/",
  authenticate,
  (req, res, next) => {
    req.apiRole = "banner_create";
    next();
  },
  authorize,
  createValidator,
  create
);

router.get(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.apiRole = "banner_update";
    next();
  },
  authorize,
  getDetail
);

router.patch(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.apiRole = "banner_update";
    next();
  },
  authorize,
  createValidator,
  update
);

router.delete(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.apiRole = "banner_delete";
    next();
  },
  authorize,
  deleteController
);

module.exports = router;
