const express = require("express");
const router = express.Router();
const controller = require("./marketConfigController");
const {authenticate} = require("../../middlewares/auth");
const {authorize} = require("../../middlewares/authorize");

router.post("/product", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.createProduct);

router.get("/product", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.getAllProduct);

router.patch("/product/changeStatus/:id/:status", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.changeStatusProduct);

router.patch("/product/:id", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.changeProduct);

router.get("/product/:id", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.getDetailProduct);

router.delete("/product/:id", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.deleteProduct);

router.post("/agency", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.createAgency);

router.patch("/agency/:id/:status", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.changeStatusAgency);

router.get("/agency", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.getListAgency);

router.get("/agency/:id", authenticate, (req, res, next) => {
    req.apiRole = "";
    next();
}, authorize, controller.getStatusAgency);

router.delete("/agency/:id", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.deleteAgency);

router.post("/group-agency", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.createGroupAgency);

router.get("/group-agency", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.getAllGroupAgency);

router.get("/group-agency/:id", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.getDetailGroupAgency);

router.patch("/group-agency/:id", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.changeGroupAgency);

router.delete("/group-agency/:id", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.deleteGroupAgency);

router.post("/image", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.createMarketImage);

router.get("/image", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.getAllMarketImage);

router.delete("/image/:id", authenticate, (req, res, next) => {
    req.apiRole = [];
    next();
}, authorize, controller.deleteMarketImage);

module.exports = router;