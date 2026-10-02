const prisma = require("../../config/prisma");
const createProduct = async (data, sellerId) => {

    // Check if category exists
    const category = await prisma.category.findUnique({
        where: {
            id: data.categoryId,
        },
    });
    if (!category) {
        throw new Error("Category not found");
    }

    // Create product
    const product = await prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            images: data.images || [],

            seller: {
                connect: {
                    id: sellerId,
                },
            },

            category: {
                connect: {
                    id: data.categoryId,
                },
            },
        },

        include: {
            seller: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            category: true,
        },
    });
    return product;
};

const getProducts = async (search, category, minPrice, maxPrice, sort, page, limit) => {
    
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    const where = {};

    if (search) {
        where.OR = [
            {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        ];
    }
    if (category) {
        where.category = {
            name: {
                equals: category,
                mode: "insensitive",
            },
        };
    }
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) {
            where.price.gte = parseFloat(minPrice);
        }
        if (maxPrice) {
            where.price.lte = parseFloat(maxPrice);
        }
    }

    const orderBy = {};
    if (sort === "price_asc") {
        orderBy.price = "asc";
    }
    if (sort === "price_desc") {
        orderBy.price = "desc";
    }
    if (sort === "oldest") {
        orderBy.createdAt = "asc";
    }
    if (Object.keys(orderBy).length === 0) {
        orderBy.createdAt = "desc";
    }
    if (sort === "latest") {
        orderBy.createdAt = "desc";
    }

    const totalProducts = await prisma.product.count({ where });
    const products = await prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
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
        orderBy,
    });
    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    return {
        products,
        totalProducts,
        totalPages,
        currentPage: page,
        hasNextPage,
        hasPrevPage,
    };
};

const getSellerProducts = async (sellerId) => {
    const products = await prisma.product.findMany({
        where: {
            sellerId,
        },
        include: {
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

    return products;
};

const getProductById = async (id) => {
    const product = await prisma.product.findUnique({
        where: {
            id,
        },

        include: {
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
    });

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};

const updateProduct = async (productId, data, sellerId) => {
    // Find Product
    const existingProduct = await prisma.product.findUnique({
        where: {
            id: productId,
        },
    });

    if (!existingProduct) {
        throw new Error("Product not found");
    }

    // Ownership Check
    if (existingProduct.sellerId !== sellerId) {
        throw new Error(
            "You are not allowed to update this product"
        );
    }

    // Check Category
    const category = await prisma.category.findUnique({
        where: {
            id: data.categoryId,
        },
    });

    if (!category) {
        throw new Error("Category not found");
    }

    // Existing images that the seller wants to keep
    let keptImages = [];

    if (data.existingImages) {
        try {
            keptImages = JSON.parse(data.existingImages);
        } catch (error) {
            throw new Error("Invalid existing images data");
        }
    }

    // Make sure only images that actually belong to the
    // existing product can be kept.
    keptImages = keptImages.filter((image) =>
        existingProduct.images.includes(image)
    );

    // New images uploaded to Cloudinary
    const newImages = data.newImageUrls || [];

    // Final image list
    const finalImages = [
        ...keptImages,
        ...newImages,
    ].slice(0, 5);

    // Update Product
    const updatedProduct = await prisma.product.update({
        where: {
            id: productId,
        },

        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,

            images: finalImages,

            category: {
                connect: {
                    id: data.categoryId,
                },
            },
        },

        include: {
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
    });

    return updatedProduct;
};

const deleteProduct = async (productId, sellerId) => {

    // Find Product
    const existingProduct = await prisma.product.findUnique({
        where: {
            id: productId,
        },
    });

    if (!existingProduct) {
        throw new Error("Product not found");
    }

    // Ownership Check
    if (existingProduct.sellerId !== sellerId) {
        throw new Error("You are not allowed to delete this product");
    }

    // Delete Product
    await prisma.product.delete({
        where: {
            id: productId,
        },
    });

    return;
};

module.exports = {
    createProduct,
    getProducts,
    getSellerProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};