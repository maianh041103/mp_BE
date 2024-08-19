const express = require("express");
const router = express.Router();
const controllers = require("./adminController");

router.patch("/:id", controllers.createAgencyController);

module.exports = router;