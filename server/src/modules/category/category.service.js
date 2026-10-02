const prisma = require("../../config/prisma");

const createCategory = async (data) => {
    return await prisma.category.create({
        data: {
            name: data.name,
            description: data.description,
        },
    });
};

const getCategories = async () => {
    return await prisma.category.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};

const updateCategory = async (id, data) => {
    return await prisma.category.update({
        where: {
            id,
        },
        data: {
            name: data.name,
            description: data.description,
        },
    });
};

const deleteCategory = async (id) => {
    return await prisma.category.delete({
        where: {
            id,
        },
    });
};

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
};