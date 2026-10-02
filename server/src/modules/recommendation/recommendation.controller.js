const recommendationService = require("./recommendation.service");


// ============================================================
// RECORD PRODUCT VIEW
// ============================================================

const recordProductView = async (req, res) => {

    try {

        const userId = req.user.id;
        const { productId } = req.params;

        const view =
            await recommendationService.recordProductView(
                userId,
                productId
            );

        res.status(200).json({
            success: true,
            message: "Product view recorded",
            view,
        });

    } catch (error) {

        console.error(
            "RECORD PRODUCT VIEW ERROR:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


// ============================================================
// RECENTLY VIEWED PRODUCTS
// ============================================================

const getRecentlyViewedProducts = async (req, res) => {

    try {

        const userId = req.user.id;

        const products =
            await recommendationService
                .getRecentlyViewedProducts(userId);

        res.status(200).json({
            success: true,
            products,
        });

    } catch (error) {

        console.error(
            "RECENTLY VIEWED ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to load recently viewed products",
        });
    }
};


// ============================================================
// RECOMMENDED FOR YOU
// ============================================================

const getRecommendedProducts = async (req, res) => {

    try {

        const userId = req.user.id;

        const products =
            await recommendationService
                .getRecommendedProducts(userId);

        res.status(200).json({
            success: true,
            products,
        });

    } catch (error) {

        console.error(
            "RECOMMENDED PRODUCTS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to load recommended products",
        });
    }
};

// Get similar products
const getSimilarProducts = async (req, res) => {
    try {
        const { productId } = req.params;

        const products =
            await recommendationService.getSimilarProducts(productId);

        res.status(200).json({
            success: true,
            products,
        });

    } catch (error) {
        console.error("SIMILAR PRODUCTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Unable to load similar products",
        });
    }
};

// ============================================================
// PERSONALIZED PRODUCTS
// ============================================================

const getPersonalizedProducts = async (req, res) => {

    try {

        const userId = req.user.id;

        const products =
            await recommendationService.getPersonalizedProducts(
                userId
            );

        res.status(200).json({
            success: true,
            products,
        });

    } catch (error) {

        console.error(
            "PERSONALIZED PRODUCTS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to load personalized products",
        });
    }
};

module.exports = {
    recordProductView,
    getRecentlyViewedProducts,
    getRecommendedProducts,
    getSimilarProducts,
    getPersonalizedProducts,
};