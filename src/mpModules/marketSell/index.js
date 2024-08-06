const express = require("express");
const router = express.Router();
const controller = require("./marketSellController");
const { authenticate } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/authorize");

router.post("/address",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.createAddress);

router.get("/address",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.getAllAddress);

router.get("/address/:id",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.getDetailAddress);

router.patch("/address/:id",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.updateAddress);

router.delete("/address/:id",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.deleteAddress);

router.get("/product/:id",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.getDetailProduct);

router.get("/store",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.getAllStore);

router.post("/cart",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.addProductToCart)

router.get("/cart",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.getProductInCart);

router.patch("/cart/:id/:quantity",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.updateQuantityProductInCart);

router.delete("/cart/:id",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.deleteProductInCart);

router.post("/market-order",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.createMarketOrder);

router.get("/market-order/:id",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.getDetailMarketOrder);

router.get("/market-order",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.getAllMarketOrder);

router.patch("/market-order/:id",authenticate,(req,res,next)=>{
    req.apiRole = [];
    next();
},authorize,controller.changeStatusMarketOrder);
module.exports = router;