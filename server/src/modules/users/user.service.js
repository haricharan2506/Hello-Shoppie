const prisma = require("../../config/prisma");

const getUserById = async (id) => {

    return await prisma.user.findUnique({

        where: {
            id,
        },

        select: {

            id: true,

            name: true,

            email: true,

            phone: true,

            avatar: true,

            address: true,

            role: true,

            createdAt: true

        }

    });

};

const updateUser = async (id, userData) => {

    return await prisma.user.update({

        where: {
            id,
        },

        data: userData,

        select: {

            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            address: true,
            role: true

        }

    });

};

const updatePassword = async (id, password) => {

    return await prisma.user.update({

        where: {
            id,
        },

        data: {
            password,
        }

    });

};

const getUserWithPassword = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id,
        },
    });
};

module.exports = {
    getUserById,
    getUserWithPassword,
    updateUser,
    updatePassword
};