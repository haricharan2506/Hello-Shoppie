const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const upload = require("../../middleware/upload.middleware");
const validate = require("../../middleware/validation.middleware");

const { productValidation } = require("./product.validation");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getSellerProducts,
} = require("./product.controller");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("SELLER"),
    upload.array("images", 5),
    productValidation,
    validate,
    createProduct
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("SELLER"),
    upload.array("images", 5),
    productValidation,
    validate,
    updateProduct
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("SELLER"),
    deleteProduct
);

router.get("/", getProducts);

router.get(
    "/seller",
    authMiddleware,
    roleMiddleware("SELLER"),
    getSellerProducts
);

router.get("/:id", getProductById);

module.exports = router;