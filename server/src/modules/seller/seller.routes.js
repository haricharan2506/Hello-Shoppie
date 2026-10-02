const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const uploadAvatar = require("../../middleware/avatarUpload.middleware");


const {
    getSellerDashboard,
    getSellerProfile,
    updateSellerProfile,
} = require("./seller.controller");

const {
    registerSeller,
} = require("./seller.auth.controller");

// Seller Registration
router.post(
    "/register",
    registerSeller
);

router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("SELLER"),
    getSellerDashboard
);

router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("SELLER"),
    getSellerProfile
);

router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("SELLER"),
    uploadAvatar.single("avatar"),
    updateSellerProfile
);

module.exports = router;