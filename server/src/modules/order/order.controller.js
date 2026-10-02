const orderService = require("./order.service");


const createOrder = async (req, res, next) => {
    try {

        const {
            customerName,
            customerPhone,
            deliveryAddress,
            deliveryCity,
            deliveryState,
            deliveryPincode,
        } = req.body;

        const order = await orderService.createOrder(
            req.user.id,
            {
                customerName,
                customerPhone,
                deliveryAddress,
                deliveryCity,
                deliveryState,
                deliveryPincode,
            }
            // No razorpayOrderId / razorpayPaymentId here — this endpoint
            // does not go through the payment gateway, so paymentStatus
            // must correctly default to "PENDING", not "SUCCESS".
        );

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });


    } catch (error) {
        next(error);
    }
};

const getMyOrders = async (req, res, next) => {
    try {

        const orders = await orderService.getMyOrders(
            req.user.id
        );


        res.status(200).json({
            success: true,
            orders,
        });


    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {

        const order = await orderService.getOrderById(
            req.user.id,
            req.params.id
        );


        res.status(200).json({
            success: true,
            order,
        });


    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {

        const order = await orderService.updateOrderStatus(
            req.params.id,
            req.body.status
        );

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });

    } catch (error) {
        next(error);
    }
};


const updateSellerOrderStatus = async (req, res, next) => {
    try {

        const order = await orderService.updateSellerOrderStatus(
            req.params.id,
            req.body.status,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });

    } catch (error) {
        next(error);
    }
};

const getSellerOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getSellerOrders(
            req.user.id
        );

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        next(error);
    }
};


const getSellerOrderById = async (req, res, next) => {
    try {
        const order = await orderService.getSellerOrderById(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    updateSellerOrderStatus,
    getSellerOrders,
    getSellerOrderById,
};