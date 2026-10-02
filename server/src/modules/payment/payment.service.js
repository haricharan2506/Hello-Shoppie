const prisma = require("../../config/prisma");
const razorpay = require("../../config/razorpay");
const crypto = require("crypto");
const orderService = require("../order/order.service");

const createPaymentOrder = async (userId) => {
    // 1. Find user's cart
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        include: {
            items: true,
        },
    });

    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }

    // 2. Get current product information from database
    let totalAmount = 0;

    for (const item of cart.items) {
        const product = await prisma.product.findUnique({
            where: {
                id: item.productId,
            },
            select: {
                id: true,
                name: true,
                price: true,
                stock: true,
            },
        });

        if (!product) {
            throw new Error(
                `Product with ID "${item.productId}" is no longer available`
            );
        }

        // 3. Validate current stock before creating Razorpay order
        if (product.stock < item.quantity) {
            throw new Error(
                `Insufficient stock for "${product.name}". ` +
                `Only ${product.stock} left, but ${item.quantity} requested.`
            );
        }

        // 4. Calculate payment amount using current database price
        totalAmount += Number(product.price) * item.quantity;
    }

    if (totalAmount <= 0) {
        throw new Error("Invalid payment amount");
    }

    // Razorpay expects amount in paise
    const amountInPaise = Math.round(totalAmount * 100);

    // 5. Create Razorpay order
    const paymentOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    });

    return {
        key: process.env.RAZORPAY_KEY_ID,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        orderId: paymentOrder.id,
    };
};


const verifyPayment = async (
    userId,
    deliveryDetails,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
) => {

    // 1. Generate expected Razorpay signature
    const generatedSignature = crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
        )
        .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    // 2. Safely compare signatures
    const expectedSignatureBuffer = Buffer.from(
        generatedSignature,
        "utf8"
    );

    const receivedSignatureBuffer = Buffer.from(
        razorpay_signature || "",
        "utf8"
    );

    if (
        expectedSignatureBuffer.length !==
        receivedSignatureBuffer.length ||
        !crypto.timingSafeEqual(
            expectedSignatureBuffer,
            receivedSignatureBuffer
        )
    ) {
        throw new Error("Payment verification failed");
    }

    // 3. Fetch the Razorpay order from Razorpay
    const razorpayOrder = await razorpay.orders.fetch(
        razorpay_order_id
    );

    if (!razorpayOrder) {
        throw new Error("Razorpay order not found");
    }

    // 4. Verify currency
    if (razorpayOrder.currency !== "INR") {
        throw new Error("Invalid payment currency");
    }

    // 5. Get the user's current cart
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        include: {
            items: true,
        },
    });

    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }

    // 6. Recalculate the current server-side cart amount
    let expectedAmount = 0;

    for (const item of cart.items) {
        const product = await prisma.product.findUnique({
            where: {
                id: item.productId,
            },
            select: {
                id: true,
                name: true,
                price: true,
                stock: true,
            },
        });

        if (!product) {
            throw new Error(
                `Product with ID "${item.productId}" is no longer available`
            );
        }

        if (product.stock < item.quantity) {
            throw new Error(
                `Insufficient stock for "${product.name}". ` +
                `Only ${product.stock} left, but ${item.quantity} requested.`
            );
        }

        expectedAmount += Number(product.price) * item.quantity;
    }

    const expectedAmountInPaise = Math.round(
        expectedAmount * 100
    );

    // 7. Make sure the Razorpay order amount matches
    //    the server-side amount
    if (Number(razorpayOrder.amount) !== expectedAmountInPaise) {
        throw new Error(
            "Payment amount does not match the current order amount"
        );
    }

    // 8. Create the actual application order
    //    The order service will perform its own final
    //    stock validation and atomic stock decrement.
    const order = await orderService.createOrder(
        userId,
        deliveryDetails,
        razorpay_order_id,
        razorpay_payment_id
    );

    return order;
};


module.exports = {
    createPaymentOrder,
    verifyPayment,
};