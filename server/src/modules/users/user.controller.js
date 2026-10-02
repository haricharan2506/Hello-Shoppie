const bcrypt = require("bcryptjs");
const { getUserById,getUserWithPassword,updateUser,updatePassword } = require("./user.service");

const getProfile = async (req, res) => {
    try {
        const user = await getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            address,
            avatar
        } = req.body;
        const updatedUser = await updateUser(
            req.user.id,
            {
                name,
                phone,
                address,
                avatar
            }
        );
        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user: updatedUser
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await getUserWithPassword(req.user.id);
        const isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect"
            });
        }
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );
        await updatePassword(
            req.user.id,
            hashedPassword
        );
        return res.status(200).json({
            success: true,
            message: "Password Changed Successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword
};