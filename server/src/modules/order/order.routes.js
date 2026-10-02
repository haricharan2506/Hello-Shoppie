const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    updateSellerOrderStatus,
    getSellerOrders,
    getSellerOrderById,
} = require("./order.controller");

router.get(
    "/seller",
    authMiddleware,
    roleMiddleware("SELLER"),
    getSellerOrders
);

router.get(
    "/seller/:id",
    authMiddleware,
    roleMiddleware("SELLER"),
    getSellerOrderById
);

router.post(
    "/",
    authMiddleware,
    createOrder
);

router.get(
    "/",
    authMiddleware,
    getMyOrders
);

router.get(
    "/:id",
    authMiddleware,
    getOrderById
);

router.put(
    "/:id/status",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateOrderStatus
);

router.put(
    "/seller/:id/status",
    authMiddleware,
    roleMiddleware("SELLER"),
    updateSellerOrderStatus
);

module.exports = router;