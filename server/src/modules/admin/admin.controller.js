const adminService = require("./admin.service");

// Get all sellers waiting for approval
const getPendingSellers = async (req, res, next) => {
    try {
        const sellers = await adminService.getPendingSellers();

        return res.status(200).json({
            success: true,
            sellers,
        });
    } catch (error) {
        console.error("GET PENDING SELLERS ERROR:", error);
        next(error);
    }
};

// Approve a seller
const approveSeller = async (req, res, next) => {
    try {
        const { sellerId } = req.params;

        const seller = await adminService.approveSeller(sellerId);

        return res.status(200).json({
            success: true,
            message: "Seller approved successfully",
            seller,
        });
    } catch (error) {
        console.error("APPROVE SELLER ERROR:", error);
        next(error);
    }
};

// Get all sellers
const getAllSellers = async (req, res, next) => {
  try {
    const sellers = await adminService.getAllSellers();

    return res.status(200).json({
      success: true,
      sellers,
    });
  } catch (error) {
    console.error("GET ALL SELLERS ERROR:", error);
    next(error);
  }
};

// Get all customers
const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await adminService.getAllCustomers();

    return res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("GET ALL CUSTOMERS ERROR:", error);
    next(error);
  }
};

// Get all products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await adminService.getAllProducts();

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET ALL PRODUCTS ERROR:", error);
    next(error);
  }
};

// Get all orders
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await adminService.getAllOrders();

        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("GET ALL ORDERS ERROR:", error);
        next(error);
    }
};

module.exports = {
    getPendingSellers,
    approveSeller,
    getAllSellers,
    getAllCustomers,
    getAllProducts,
    getAllOrders,
};