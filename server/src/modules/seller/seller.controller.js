const sellerService = require("./seller.service");

const getSellerDashboard = async (req, res, next) => {
    try {
        const dashboard = await sellerService.getSellerDashboard(
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Seller dashboard fetched successfully",
            ...dashboard,
        });
    } catch (error) {
        next(error);
    }
};

const getSellerProfile = async (req, res, next) => {
    try {
        const seller = await sellerService.getSellerProfile(
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Seller profile fetched successfully",
            seller,
        });
    } catch (error) {
        next(error);
    }
};

const updateSellerProfile = async (req, res, next) => {
    try {
        const seller = await sellerService.updateSellerProfile(
            req.user.id,
            req.body,
            req.file 
        );

        res.status(200).json({
            success: true,
            message: "Seller profile updated successfully",
            seller,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSellerDashboard,
    getSellerProfile,
    updateSellerProfile,
};