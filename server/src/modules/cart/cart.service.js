const prisma = require("../../config/prisma");


const addToCart = async (userId, productId, quantity = 1) => {

    // 1. Find user's cart
    let cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
    });


    // 2. If cart doesn't exist, create one
    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId,
            },
        });
    }


    // 3. Check if product already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
    });


    // 4. If product exists, increase quantity
    if (existingItem) {

        return await prisma.cartItem.update({
            where: {
                id: existingItem.id,
            },

            data: {
                quantity: existingItem.quantity + quantity,
            },

            include: {
                product: true,
            },
        });
    }


    // 5. Otherwise create new cart item
    return await prisma.cartItem.create({
        data: {
            cartId: cart.id,
            productId,
            quantity,
        },

        include: {
            product: true,
        },
    });
};

const getCart = async (userId) => {

    const cart = await prisma.cart.findUnique({
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
    });


    if (!cart) {
        throw new Error("Cart not found");
    }


    return cart;
};

const updateCartItem = async (userId, itemId, quantity) => {

    if (quantity < 1) {
        throw new Error("Quantity must be greater than 0");
    }


    const cartItem = await prisma.cartItem.findUnique({
        where: {
            id: itemId,
        },

        include: {
            cart: true,
        },
    });


    if (!cartItem) {
        throw new Error("Cart item not found");
    }


    if (cartItem.cart.userId !== userId) {
        throw new Error("You are not allowed to update this item");
    }


    return await prisma.cartItem.update({
        where: {
            id: itemId,
        },

        data: {
            quantity,
        },

        include: {
            product: true,
        },
    });
};

const removeFromCart = async (userId, itemId) => {

    const cartItem = await prisma.cartItem.findUnique({
        where: {
            id: itemId,
        },

        include: {
            cart: true,
        },
    });


    if (!cartItem) {
        throw new Error("Cart item not found");
    }


    if (cartItem.cart.userId !== userId) {
        throw new Error("You are not allowed to remove this item");
    }


    return await prisma.cartItem.delete({
        where: {
            id: itemId,
        },
    });
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
};