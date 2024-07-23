const { authenticate } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/authorize");
const {
  indexDoctorsController,
  readDoctorController,
  createDoctorController,
  updateDoctorController,
  deleteDoctorController,
  createDoctorByUploadController
} = require("./doctorController");
const { createValidator } = require("./doctorValidator");

const express = require("express");
const router = new express.Router();

router.get(
  "/",
  authenticate,
  (req, res, next) => {
    req.apiRole = ["doctor_read"];
    next();
  },
  authorize,
  indexDoctorsController
);

router.post(
  "/",
  authenticate,
  (req, res, next) => {
    req.apiRole = "doctor_create";
    next();
  },
  authorize,
  createValidator,
  createDoctorController
);

router.get(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.apiRole = "doctor_update";
    next();
  },
  authorize,
  readDoctorController
);

router.patch(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.apiRole = ["doctor_read", "doctor_update"];
    next();
  },
  authorize,
  createValidator,
  updateDoctorController
);

router.delete(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.apiRole = "doctor_delete";
    next();
  },
  authorize,
  deleteDoctorController
);

router.post(
  "/upload",
  authenticate,
  (req, res, next) => {
    req.apiRole = "doctor_create";
    next();
  },
  authorize,
  createDoctorByUploadController
);

module.exports = router;
