const prisma = require("../../config/prisma");

// Get all sellers waiting for approval
const getPendingSellers = async () => {
    return await prisma.user.findMany({
        where: {
            role: "SELLER",
            isApproved: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isApproved: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

// Approve a seller
const approveSeller = async (sellerId) => {
    return await prisma.user.update({
        where: {
            id: sellerId,
        },
        data: {
            isApproved: true,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isApproved: true,
        },
    });
};

// Get all sellers

const getAllSellers = async () => {
  return await prisma.user.findMany({
    where: {
      role: "SELLER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isApproved: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get all customers
const getAllCustomers = async () => {
  return await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      address: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get all products
const getAllProducts = async () => {
  return await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      stock: true,
      images: true,
      sellerId: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,

      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get all orders for admin
const getAllOrders = async () => {
    return await prisma.order.findMany({
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
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

module.exports = {
    getPendingSellers,
    approveSeller,
    getAllSellers,
    getAllCustomers,
    getAllProducts,
    getAllOrders,
};