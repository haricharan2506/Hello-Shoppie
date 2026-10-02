const prisma = require("../../config/prisma");

// Find user by email
const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
};

// Create a new seller
const createSeller = async (sellerData) => {
    return await prisma.user.create({
        data: {
            ...sellerData,
            role: "SELLER",
            isApproved: false,
        },
    });
};

// Get seller dashboard
// Get seller dashboard
const getSellerDashboard = async (sellerId) => {
    const seller = await prisma.user.findUnique({
        where: {
            id: sellerId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            address: true,
            role: true,
            isApproved: true,
            createdAt: true,
        },
    });

    if (!seller) {
        throw new Error("Seller not found");
    }

    // Get total products
    const totalProducts = await prisma.product.count({
        where: {
            sellerId,
        },
    });

    // Get orders containing this seller's products
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
                            sellerId: true,
                        },
                    },
                },
            },
        },
    });

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => order.status === "PENDING"
    ).length;

    // Calculate revenue only from this seller's products
    const revenue = orders
        .filter(
            (order) => order.paymentStatus === "SUCCESS"
        )
        .reduce((total, order) => {
            const sellerRevenue = order.items.reduce(
                (orderTotal, item) => {
                    return (
                        orderTotal +
                        Number(item.price) * item.quantity
                    );
                },
                0
            );

            return total + sellerRevenue;
        }, 0);

    return {
        seller,

        stats: {
            totalProducts,
            totalOrders,
            pendingOrders,
            revenue,
        },
    };
};

const getSellerProfile = async (sellerId) => {
    const seller = await prisma.user.findUnique({
        where: {
            id: sellerId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            address: true,
            role: true,
            isApproved: true,
            createdAt: true,
        },
    });

    if (!seller) {
        throw new Error("Seller not found");
    }

    return seller;
};

const updateSellerProfile = async (sellerId, data, file) => {
    const seller = await prisma.user.findUnique({
        where: {
            id: sellerId,
        },
    });

    if (!seller) {
        throw new Error("Seller not found");
    }

    const updateData = {
        name: data.name,
        phone: data.phone,
        address: data.address,
    };

    // If a new avatar is uploaded, include it in the update
    if(file) {
        updateData.avatar = file.path; // Assuming the file path is stored in file.path
    }

    const updatedSeller = await prisma.user.update({
        where: {
            id: sellerId,
        },
        data: updateData,

        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            address: true,
            role: true,
            isApproved: true,
            createdAt: true,
        },
    });

    return updatedSeller;
};

module.exports = {
    findUserByEmail,
    createSeller,
    getSellerDashboard,
    getSellerProfile,
    updateSellerProfile,
};