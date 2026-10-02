const express = require("express");

const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPasswordController,
} = require("./auth.controller");

const validate = require("../../middleware/validation.middleware");

const {
  registerValidation,
  loginValidation,
} = require("./auth.validation");

router.post(
  "/register",
  registerValidation,
  validate,
  register
);

router.post(
  "/login",
  loginValidation,
  validate,
  login
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordController
);

module.exports = router;