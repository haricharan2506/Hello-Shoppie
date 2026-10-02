const productService = require("./product.service");

const createProduct = async (req, res, next) => {
    try {
        const imageUrls = req.files?.map((file) => file.path) || [];

        req.body.images = imageUrls;
        req.body.price = parseFloat(req.body.price);
        req.body.stock = parseInt(req.body.stock);

        const product = await productService.createProduct(
            req.body,
            req.user.id
        );

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const result = await productService.getProducts(
            req.query.search,
            req.query.category,
            req.query.minPrice,
            req.query.maxPrice,
            req.query.sort,
            req.query.page,
            req.query.limit
        );

        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const newImageUrls = (req.files || []).map(
            (file) => file.path
        );

        req.body.price = parseFloat(req.body.price);
        req.body.stock = parseInt(req.body.stock);

        const product = await productService.updateProduct(
            req.params.id,
            {
                ...req.body,
                newImageUrls,
            },
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (error) {
        next(error);
    }
};

const getSellerProducts = async (req, res, next) => {
    try {
        const products = await productService.getSellerProducts(
            req.user.id
        );

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getProducts,
    getSellerProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};