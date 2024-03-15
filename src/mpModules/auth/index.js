const express = require("express");
const {
  loginController,
  registerController,
  changePasswordController,
  readUserProfileController,
  updateUserProfileController,
} = require("./authController");
const { authenticate } = require("../../middlewares/auth.js");

const router = new express.Router();

router.post("/login", loginController);
router.get("/profile", authenticate, readUserProfileController);
router.post("/register", registerController);
router.post("/change-password", authenticate, changePasswordController);
router.post("/profile", authenticate, updateUserProfileController);

module.exports = router;
