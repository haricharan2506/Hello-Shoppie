const prisma = require("../../config/prisma");

/**
 * Search the actual store catalog.
 *
 * This is used internally by the AI assistant.
 * The AI never gets direct database access.
 *
 * `category`, when provided, is expected to already be a canonical
 * category name (as resolved by detectCategory() in chat.service.js),
 * so it is matched with an exact (case-insensitive) comparison rather
 * than `contains` - this avoids accidental substring matches (e.g. a
 * "Books" filter matching a future "Notebooks & Stationery" category).
 */
const searchProducts = async ({
    search,
    category,
    minPrice,
    maxPrice,
    sort,
}) => {
    try {
        const where = {
            stock: {
                gt: 0,
            },
        };

        // Keyword search - only over name/description. Category is
        // handled as its own precise filter below, not folded into
        // this OR, so a keyword search can't accidentally widen or
        // conflict with an already-detected category.
        if (search && search.trim()) {
            const keyword = search.trim();

            where.OR = [
                {
                    name: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
            ];
        }

        // Category filter - exact (case-insensitive) match on the
        // canonical category name.
        if (category && category.trim()) {
            where.category = {
                name: {
                    equals: category.trim(),
                    mode: "insensitive",
                },
            };
        }

        // Price filters - only apply a bound if it's an
        // actual finite number, so a bad/NaN value never
        // silently produces a broken WHERE clause.
        const numericMinPrice = Number(minPrice);
        const numericMaxPrice = Number(maxPrice);

        const hasMinPrice =
            minPrice !== undefined &&
            Number.isFinite(numericMinPrice);

        const hasMaxPrice =
            maxPrice !== undefined &&
            Number.isFinite(numericMaxPrice);

        if (hasMinPrice || hasMaxPrice) {
            where.price = {};

            if (hasMinPrice) {
                where.price.gte = numericMinPrice;
            }

            if (hasMaxPrice) {
                where.price.lte = numericMaxPrice;
            }
        }

        // Sorting
        let orderBy = {
            createdAt: "desc",
        };

        if (sort === "price_asc") {
            orderBy = {
                price: "asc",
            };
        } else if (sort === "price_desc") {
            orderBy = {
                price: "desc",
            };
        } else if (sort === "oldest") {
            orderBy = {
                createdAt: "asc",
            };
        }

        const products = await prisma.product.findMany({
            where,
            take: 8,
            orderBy,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                images: true,

                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },

                seller: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            images: product.images || [],
            category: product.category?.name || null,
            seller: product.seller?.name || null,
        }));
    } catch (error) {
        console.error(
            "Search Products Tool Error:",
            error
        );

        throw error;
    }
};

module.exports = {
    searchProducts,
};