const prisma = require("../../config/prisma");

// ============================================================
// RECORD PRODUCT VIEW
// ============================================================

const recordProductView = async (userId, productId) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
    });

    if (!product) {
        throw new Error("Product not found");
    }

    const view = await prisma.productView.upsert({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },

        update: {
            viewedAt: new Date(),
        },

        create: {
            userId,
            productId,
        },
    });

    return view;
};


// ============================================================
// RECENTLY VIEWED PRODUCTS
// ============================================================

const getRecentlyViewedProducts = async (userId, limit = 6) => {
    const views = await prisma.productView.findMany({
        where: {
            userId,
        },

        orderBy: {
            viewedAt: "desc",
        },

        take: limit,

        include: {
            product: {
                include: {
                    category: true,

                    seller: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    return views.map((view) => view.product);
};

// Get similar products
const getSimilarProducts = async (productId, limit = 6) => {
    // First get the current product
    const currentProduct = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
            categoryId: true,
        },
    });

    if (!currentProduct) {
        throw new Error("Product not found");
    }

    // Find other products in the same category
    const products = await prisma.product.findMany({
        where: {
            categoryId: currentProduct.categoryId,

            // Never recommend the product currently being viewed
            id: {
                not: productId,
            },

            // Only products that are available
            stock: {
                gt: 0,
            },
        },

        include: {
            category: true,

            seller: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },

        take: limit,
    });

    return products;
};

// ============================================================
// RECOMMENDED FOR YOU
// ============================================================

const getRecommendedProducts = async (userId, limit = 8) => {

    // ----------------------------------------------------------
    // 1. Get the user's recent views
    // ----------------------------------------------------------

    const recentViews = await prisma.productView.findMany({
        where: {
            userId,
        },

        orderBy: {
            viewedAt: "desc",
        },

        take: 10,

        select: {
            productId: true,

            product: {
                select: {
                    categoryId: true,
                },
            },
        },
    });


    // ----------------------------------------------------------
    // 2. If user has no history, return newest products
    // ----------------------------------------------------------

    if (recentViews.length === 0) {

        return prisma.product.findMany({
            orderBy: {
                createdAt: "desc",
            },

            take: limit,

            include: {
                category: true,

                seller: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }


    // ----------------------------------------------------------
    // 3. Get categories the user is interested in
    // ----------------------------------------------------------

    const categoryIds = [
        ...new Set(
            recentViews
                .map((view) => view.product?.categoryId)
                .filter(Boolean)
        ),
    ];


    // ----------------------------------------------------------
    // 4. Get products already viewed by this user
    // ----------------------------------------------------------

    const viewedProductIds = recentViews.map(
        (view) => view.productId
    );


    // ----------------------------------------------------------
    // 5. Find products from user's interested categories
    // ----------------------------------------------------------

    const recommendedProducts =
        await prisma.product.findMany({
            where: {
                categoryId: {
                    in: categoryIds,
                },

                id: {
                    notIn: viewedProductIds,
                },

                stock: {
                    gt: 0,
                },
            },

            orderBy: [
                {
                    createdAt: "desc",
                },
            ],

            take: limit,

            include: {
                category: true,

                seller: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });


    // ----------------------------------------------------------
    // 6. If not enough category products exist,
    //    fill remaining slots with latest products
    // ----------------------------------------------------------

    if (recommendedProducts.length < limit) {

        const existingIds = [
            ...viewedProductIds,
            ...recommendedProducts.map(
                (product) => product.id
            ),
        ];

        const remainingProducts =
            await prisma.product.findMany({
                where: {
                    id: {
                        notIn: existingIds,
                    },

                    stock: {
                        gt: 0,
                    },
                },

                orderBy: {
                    createdAt: "desc",
                },

                take: limit - recommendedProducts.length,

                include: {
                    category: true,

                    seller: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

        return [
            ...recommendedProducts,
            ...remainingProducts,
        ];
    }


    return recommendedProducts;
};

// ============================================================
// PERSONALIZED PRODUCTS
// ============================================================

const getPersonalizedProducts = async (userId, limit = 8) => {

    // ----------------------------------------------------------
    // 1. Get recently viewed products
    // ----------------------------------------------------------

    const recentViews = await prisma.productView.findMany({
        where: {
            userId,
        },

        orderBy: {
            viewedAt: "desc",
        },

        take: 20,

        include: {
            product: {
                select: {
                    id: true,
                    categoryId: true,
                },
            },
        },
    });


    // ----------------------------------------------------------
    // 2. Get products currently in the user's cart
    // ----------------------------------------------------------

    const cartItems = await prisma.cartItem.findMany({
        where: {
            cart: {
                userId,
            },
        },

        include: {
            product: {
                select: {
                    id: true,
                    categoryId: true,
                },
            },
        },
    });


    // ----------------------------------------------------------
    // 3. Get products purchased by the user
    // ----------------------------------------------------------

    const orderItems = await prisma.orderItem.findMany({
        where: {
            order: {
                userId,
                status: {
                    not: "CANCELLED",
                },
            },
        },

        include: {
            product: {
                select: {
                    id: true,
                    categoryId: true,
                },
            },
        },
    });


    // ----------------------------------------------------------
    // 4. Calculate category interest scores
    // ----------------------------------------------------------

    const categoryScores = {};

    const addCategoryScore = (categoryId, score) => {

        if (!categoryId) {
            return;
        }

        categoryScores[categoryId] =
            (categoryScores[categoryId] || 0) + score;
    };


    // Viewed = low interest
    recentViews.forEach((view) => {
        addCategoryScore(
            view.product?.categoryId,
            1
        );
    });


    // Cart = stronger interest
    cartItems.forEach((item) => {
        addCategoryScore(
            item.product?.categoryId,
            3
        );
    });


    // Purchased = strongest interest
    orderItems.forEach((item) => {
        addCategoryScore(
            item.product?.categoryId,
            5
        );
    });


    // ----------------------------------------------------------
    // 5. Get categories ordered by user's interest
    // ----------------------------------------------------------

    const interestedCategoryIds = Object.entries(categoryScores)
        .sort((a, b) => b[1] - a[1])
        .map(([categoryId]) => categoryId);


    // ----------------------------------------------------------
    // 6. If user has no behavior history
    // ----------------------------------------------------------

    if (interestedCategoryIds.length === 0) {

        return prisma.product.findMany({
            where: {
                stock: {
                    gt: 0,
                },
            },

            orderBy: {
                createdAt: "desc",
            },

            take: limit,

            include: {
                category: true,

                seller: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }


    // ----------------------------------------------------------
    // 7. Products already interacted with
    // ----------------------------------------------------------

    const viewedProductIds = recentViews.map(
        (view) => view.productId
    );

    const cartProductIds = cartItems.map(
        (item) => item.productId
    );

    const purchasedProductIds = orderItems.map(
        (item) => item.productId
    );


    const excludedProductIds = [
        ...new Set([
            ...viewedProductIds,
            ...cartProductIds,
            ...purchasedProductIds,
        ]),
    ];


    // ----------------------------------------------------------
    // 8. Get candidate products
    // ----------------------------------------------------------

    const candidates = await prisma.product.findMany({
        where: {
            categoryId: {
                in: interestedCategoryIds,
            },

            id: {
                notIn: excludedProductIds,
            },

            stock: {
                gt: 0,
            },
        },

        include: {
            category: true,

            seller: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });


    // ----------------------------------------------------------
    // 9. Sort products by personalization score
    // ----------------------------------------------------------

    const personalizedProducts = candidates
        .map((product) => ({
            product,
            score: categoryScores[product.categoryId] || 0,
        }))
        .sort((a, b) => {

            if (b.score !== a.score) {
                return b.score - a.score;
            }

            // If scores are equal,
            // show newer products first.
            return (
                new Date(b.product.createdAt) -
                new Date(a.product.createdAt)
            );
        })
        .slice(0, limit)
        .map((item) => item.product);


    // ----------------------------------------------------------
    // 10. Return personalized products
    // ----------------------------------------------------------

    return personalizedProducts;
};

module.exports = {
    recordProductView,
    getRecentlyViewedProducts,
    getRecommendedProducts,
    getSimilarProducts,
    getPersonalizedProducts,
};