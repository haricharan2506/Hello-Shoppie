const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} = require("./category.controller");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createCategory
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateCategory
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteCategory
);

router.get("/", getCategories);

module.exports = router;