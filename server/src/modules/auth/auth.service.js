const prisma = require("../../config/prisma");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const {
  sendEmail,
} = require("../notification/notification.service");

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

const createPasswordResetToken = async ({
  userId,
  tokenHash,
  expiresAt,
}) => {
  return await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });
};

const findPasswordResetToken = async (tokenHash) => {
  return await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });
};

const markPasswordResetTokenUsed = async (tokenId) => {
  return await prisma.passwordResetToken.update({
    where: {
      id: tokenId,
    },
    data: {
      usedAt: new Date(),
    },
  });
};

const updateUserPassword = async (userId, hashedPassword) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
};

const requestPasswordReset = async (email) => {
  const user = await findUserByEmail(email);

  // Always return the same result for unknown emails.
  // This prevents account enumeration.
  if (!user) {
    return {
      success: true,
      message:
        "If an account exists with that email, a password reset link has been sent.",
    };
  }

  // Remove any previous unused reset tokens for this user.
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
      usedAt: null,
    },
  });

  // Generate a cryptographically secure random token.
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Store only the hash in the database.
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // Token expires after 30 minutes.
  const expiresAt = new Date(
    Date.now() + 30 * 60 * 1000
  );

  await createPasswordResetToken({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  const frontendUrl =
    process.env.FRONTEND_URL || "http://localhost:5173";

  const resetUrl =
    `${frontendUrl}/reset-password?token=${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your Hello, Shoppie! password",
    text: `
Hello ${user.name},

We received a request to reset your Hello, Shoppie! password.

Use the following link to reset your password:

${resetUrl}

This link will expire in 30 minutes.

If you did not request a password reset, you can safely ignore this email.

Thank you,
Hello, Shoppie!
    `,
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 24px;
        color: #222;
      ">

        <h1 style="color: #0B3D3A;">
          🛍️ Hello, Shoppie!
        </h1>

        <h2>Password Reset</h2>

        <p>
          Hello <strong>${user.name}</strong>,
        </p>

        <p>
          We received a request to reset your Hello, Shoppie!
          account password.
        </p>

        <div style="margin: 28px 0;">
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 14px 24px;
              background: #0B3D3A;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
            "
          >
            Reset My Password
          </a>
        </div>

        <p>
          This link will expire in <strong>30 minutes</strong>.
        </p>

        <p style="color: #666;">
          If you did not request a password reset, you can safely
          ignore this email.
        </p>

        <hr style="border: 0; border-top: 1px solid #eee;" />

        <p style="color: #888; font-size: 13px;">
          This is an automated message from Hello, Shoppie!
        </p>

      </div>
    `,
  });

  return {
    success: true,
    message:
      "If an account exists with that email, a password reset link has been sent.",
  };
};

const resetPassword = async (rawToken, newPassword) => {
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const resetToken = await findPasswordResetToken(tokenHash);

  if (!resetToken) {
    throw new Error("Invalid or expired password reset link");
  }

  if (resetToken.usedAt) {
    throw new Error("This password reset link has already been used");
  }

  if (resetToken.expiresAt < new Date()) {
    throw new Error("This password reset link has expired");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    await tx.passwordResetToken.update({
      where: {
        id: resetToken.id,
      },
      data: {
        usedAt: new Date(),
      },
    });
  });

  return {
    success: true,
    message: "Password reset successfully",
  };
};

module.exports = {
  findUserByEmail,
  createUser,
  createPasswordResetToken,
  findPasswordResetToken,
  markPasswordResetTokenUsed,
  updateUserPassword,
  requestPasswordReset,
  resetPassword,
};