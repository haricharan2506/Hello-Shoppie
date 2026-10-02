const express = require("express");

const router = express.Router();

const {
    recordProductView,
    getRecentlyViewedProducts,
    getRecommendedProducts,
    getSimilarProducts,
    getPersonalizedProducts,
} = require("./recommendation.controller");

const authMiddleware = require("../../middleware/auth.middleware");


// ============================================================
// RECORD PRODUCT VIEW
// ============================================================

router.post(
    "/view/:productId",
    authMiddleware,
    recordProductView
);


// ============================================================
// RECENTLY VIEWED PRODUCTS
// ============================================================

router.get(
    "/recently-viewed",
    authMiddleware,
    getRecentlyViewedProducts
);

// Similar products
router.get(
    "/similar/:productId",
    getSimilarProducts
);


// ============================================================
// RECOMMENDED FOR YOU
// ============================================================

router.get(
    "/recommended",
    authMiddleware,
    getRecommendedProducts
);

// ============================================================
// PERSONALIZED PRODUCTS
// ============================================================

router.get(
    "/personalized",
    authMiddleware,
    getPersonalizedProducts
);

module.exports = router;