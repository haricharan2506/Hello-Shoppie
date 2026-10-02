const cartService = require("./cart.service");
const updateCartItem = async (req, res, next) => {
    try {

        const updatedItem = await cartService.updateCartItem(
            req.user.id,
            req.params.itemId,
            req.body.quantity
        );


        res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            item: updatedItem,
        });


    } catch (error) {
        next(error);
    }
};


const addToCart = async (req, res, next) => {
    try {

        const cartItem = await cartService.addToCart(
            req.user.id,
            req.body.productId,
            req.body.quantity
        );


        res.status(201).json({
            success: true,
            message: "Product added to cart",
            cartItem,
        });


    } catch (error) {
        next(error);
    }
};

const getCart = async (req, res, next) => {
    try {

        const cart = await cartService.getCart(
            req.user.id
        );


        res.status(200).json({
            success: true,
            cart,
        });


    } catch (error) {
        next(error);
    }
};

const removeFromCart = async (req, res, next) => {
    try {

        const deletedItem = await cartService.removeFromCart(
            req.user.id,
            req.params.itemId
        );


        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            deletedItem,
        });


    } catch (error) {
        next(error);
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
};