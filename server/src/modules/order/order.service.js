const prisma = require("../../config/prisma");
const {
    sendOrderConfirmationEmail,
    sendOrderStatusEmail,
} = require("../notification/notification.service");


const createOrder = async (
    userId,
    deliveryDetails,
    razorpayOrderId = null,
    razorpayPaymentId = null
) => {
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

    // 2. Everything related to price, stock, order creation,
    //    stock decrement, and cart clearing happens in one transaction.
    const order = await prisma.$transaction(async (tx) => {
        let totalAmount = 0;
        const orderItems = [];

        // 3. Get the CURRENT product data inside the transaction
        for (const item of cart.items) {
            const product = await tx.product.findUnique({
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

            // 4. Atomically check stock and decrement it
            const stockUpdate = await tx.product.updateMany({
                where: {
                    id: item.productId,
                    stock: {
                        gte: item.quantity,
                    },
                },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });

            if (stockUpdate.count !== 1) {
                throw new Error(
                    `Insufficient stock for "${product.name}". ` +
                    `Only ${product.stock} left, but ${item.quantity} requested.`
                );
            }

            // 5. Use the CURRENT database price
            totalAmount += Number(product.price) * item.quantity;

            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
            });
        }

        // 6. Create the order using the current prices
        const createdOrder = await tx.order.create({
            data: {
                userId,

                customerName: deliveryDetails.customerName,
                customerPhone: deliveryDetails.customerPhone,
                deliveryAddress: deliveryDetails.deliveryAddress,
                deliveryCity: deliveryDetails.deliveryCity,
                deliveryState: deliveryDetails.deliveryState,
                deliveryPincode: deliveryDetails.deliveryPincode,

                totalAmount,

                paymentStatus: razorpayPaymentId
                    ? "SUCCESS"
                    : "PENDING",

                razorpayOrderId,
                razorpayPaymentId,

                items: {
                    create: orderItems,
                },
            },

            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // 7. Clear the cart only after the order was successfully created
        await tx.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            },
        });

        return createdOrder;
    });

    try {
        await sendOrderConfirmationEmail(order);
    } catch (error) {
        console.error(
            "❌ Failed to send order confirmation email for order ID:",
            error.message
        );
    }

    return order;
};

const getMyOrders = async (userId) => {

    const orders = await prisma.order.findMany({
        where: {
            userId,
        },

        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });


    return orders;
};

const getOrderById = async (userId, orderId) => {

    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },

        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });


    if (!order) {
        throw new Error("Order not found");
    }


    if (order.userId !== userId) {
        throw new Error("You are not allowed to view this order");
    }


    return order;
};

const updateOrderStatus = async (orderId, status) => {
    // Admin can update any order
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    const updatedOrder = await prisma.order.update({
        where: {
            id: orderId,
        },

        data: {
            status,
        },

        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    try {
        await sendOrderStatusEmail(updatedOrder);
    } catch (error) {
        console.error(
            "❌ Failed to send order status email for order ID:",
            error.message
        );
    }

    return updatedOrder;
};

const updateSellerOrderStatus = async (orderId, status, sellerId) => {

    // Check that this order contains a product
    // belonging to the logged-in seller
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            items: {
                some: {
                    product: {
                        sellerId,
                    },
                },
            },
        },
    });

    if (!order) {
        throw new Error(
            "Order not found or you are not allowed to update this order"
        );
    }

    const updatedOrder = await prisma.order.update({
        where: {
            id: orderId,
        },

        data: {
            status,
        },

        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    try {
        await sendOrderStatusEmail(updatedOrder);
    } catch (error) {
        console.error(
            "❌ Failed to send order status email for order ID:",
            error.message
        );
    }

    return updatedOrder;
};

const getSellerOrders = async (sellerId) => {
    const orders = await prisma.order.findMany({
        where: {
            items: {
                some: {
                    product: {
                        sellerId,
                    },
                },
            },
        },

        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },

            items: {
                where: {
                    product: {
                        sellerId,
                    },
                },

                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            images: true,
                            sellerId: true,
                            category: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });

    return orders;
};


const getSellerOrderById = async (orderId, sellerId) => {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,

            items: {
                some: {
                    product: {
                        sellerId,
                    },
                },
            },
        },

        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },

            items: {
                where: {
                    product: {
                        sellerId,
                    },
                },

                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            images: true,
                            sellerId: true,
                            category: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!order) {
        throw new Error(
            "Order not found or you are not allowed to view this order"
        );
    }

    return order;
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