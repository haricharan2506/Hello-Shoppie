const bcrypt = require("bcryptjs");

const sellerService = require("./seller.service");

const registerSeller = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validate required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name, email, phone and password are required",
            });
        }

        // Check if email already exists
        const existingUser = await sellerService.findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create seller
        const seller = await sellerService.createSeller({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        return res.status(201).json({
            success: true,
            message: "Seller registration submitted. Waiting for admin approval.",
            seller: {
                id: seller.id,
                name: seller.name,
                email: seller.email,
                phone: seller.phone,
                role: seller.role,
                isApproved: seller.isApproved,
            },
        });
    } catch (error) {
        console.error("SELLER REGISTER ERROR:", error);
        next(error);
    }
};

module.exports = {
    registerSeller,
};