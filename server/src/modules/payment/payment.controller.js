const paymentService = require("./payment.service");

const createPaymentOrder = async (req, res, next) => {
    try {

        const payment = await paymentService.createPaymentOrder(req.user.id);

        res.status(200).json({
            success: true,
            payment,
        });

    } catch (error) {
        next(error);
    }
};

const verifyPayment = async (req, res, next) => {
    try {

        const {
            customerName,
            customerPhone,
            deliveryAddress,
            deliveryCity,
            deliveryState,
            deliveryPincode,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const deliveryDetails = {
            customerName,
            customerPhone,
            deliveryAddress,
            deliveryCity,
            deliveryState,
            deliveryPincode,
        };

        const order = await paymentService.verifyPayment(
            req.user.id,
            deliveryDetails,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
};