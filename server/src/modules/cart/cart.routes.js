const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");

const {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
} = require("./cart.controller");


router.post(
    "/add",
    authMiddleware,
    addToCart
);

router.get(
    "/",
    authMiddleware,
    getCart
);

router.put(
    "/item/:itemId",
    authMiddleware,
    updateCartItem
);

router.delete(
    "/item/:itemId",
    authMiddleware,
    removeFromCart
);

module.exports = router;