const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");

const {
  findUserByEmail,
  createUser,
  requestPasswordReset,
  resetPassword,

} = require("./auth.service");

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const token = generateToken(user.id, user.role);
    res.status(201).json({
      success: true,
      message: "Registration Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:");
    console.error(error);

    return res.status(500).json({
        success: false,
        message: error.message,
        error,
    });
 }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // check sseller approval
    if (user.role === "SELLER" && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Your seller account is not approved yet. Please wait for admin approval.",
      });
    }

    // Generate JWT
    const token = generateToken(user.id, user.role);
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await requestPasswordReset(email);

    return res.status(200).json(result);
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request.",
    });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    const result = await resetPassword(token, password);

    return res.status(200).json(result);
  } catch (error) {
    console.error("RESET PASSWORD ERROR:");
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to reset password.",
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPasswordController,

};

