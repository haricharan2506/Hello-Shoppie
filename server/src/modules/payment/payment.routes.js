const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");

const {
    createPaymentOrder,
    verifyPayment,
} = require("./payment.controller");

router.post(
    "/create-order",
    authMiddleware,
    createPaymentOrder
);

router.post(
    "/verify",
    authMiddleware,
    verifyPayment
);

module.exports = router;