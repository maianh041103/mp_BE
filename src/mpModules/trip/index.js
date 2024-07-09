const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/authorize");
const tripController = require("./tripController");

router.post("/", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, tripController.createTrip);

router.get("/", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, tripController.getTrips);

router.get("/:id", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, tripController.getDetailTrip);

router.patch("/:id", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, tripController.updateTrip);

router.patch("/:tripCustomerId/:status", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, tripController.changeStatusTrip);

router.get("/search/ref", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, tripController.searchMap);

router.get("/search/place", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, tripController.getPlace);

module.exports = router;

