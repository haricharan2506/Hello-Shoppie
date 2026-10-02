const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");

const {
    getProfile,
    updateProfile,
    changePassword
} = require("./user.controller");
router.get(
    "/profile",
    authMiddleware,
    getProfile,
);
router.put(
    "/profile",
    authMiddleware,
    updateProfile
);
router.put(
    "/change-password",
    authMiddleware,
    changePassword
);

const roleMiddleware = require("../../middleware/role.middleware");
router.get(
    "/seller",
    authMiddleware,
    roleMiddleware("SELLER"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Seller"
        });
    }
);

module.exports = router;