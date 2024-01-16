const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
// signUp
router.post("/shop/signup", asyncHandler(accessController.signUp));
// signIn
router.post("/shop/signin", asyncHandler(accessController.signIn));

// authentication
router.use(authentication);
// logout
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/handleRefreshToken",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
