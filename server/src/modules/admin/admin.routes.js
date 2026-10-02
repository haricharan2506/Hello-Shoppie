const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

const {
    getPendingSellers,
    approveSeller,
    getAllSellers,
    getAllCustomers,
    getAllProducts,
    getAllOrders,
} = require("./admin.controller");

// Get all sellers
router.get(
    "/sellers",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllSellers
);

// Get pending sellers
router.get(
    "/sellers/pending",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getPendingSellers
);

// Approve seller
router.patch(
    "/sellers/:sellerId/approve",
    authMiddleware,
    roleMiddleware("ADMIN"),
    approveSeller
);

// Get all customers
router.get(
    "/customers",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllCustomers
);

// Get all products
router.get(
  "/products",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllProducts
);

// Get all orders
router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllOrders
);

module.exports = router;