const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


const sendEmail = async ({
    to,
    subject,
    html,
    text,
}) => {
    try {
        const mailOptions = {
            from: `"${process.env.SMTP_FROM}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("📧 Email sent successfully:", info.messageId);

        return {
            success: true,
            messageId: info.messageId,
        };

    } catch (error) {
        console.error("❌ Email sending failed:", error);

        throw error;
    }
};


/*
 * Send order confirmation email
 */
const sendOrderConfirmationEmail = async (order) => {

    const customerEmail = order.user?.email;

    if (!customerEmail) {
        console.warn(
            "⚠️ Order confirmation email skipped: customer email not found."
        );

        return {
            success: false,
            skipped: true,
            reason: "Customer email not found",
        };
    }


    const customerName =
        order.customerName ||
        order.user?.name ||
        "Customer";


    const orderItems = order.items
        .map((item) => {
            const productName =
                item.product?.name || "Product";

            const quantity = item.quantity;

            const price = Number(item.price);

            const subtotal = price * quantity;

            return `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                        ${productName}
                    </td>

                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                        ${quantity}
                    </td>

                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                        ₹${price.toFixed(2)}
                    </td>

                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                        ₹${subtotal.toFixed(2)}
                    </td>
                </tr>
            `;
        })
        .join("");


    const subject = `Order Confirmed — #${order.id}`;


    const text = `
Hello ${customerName},

Thank you for shopping with Hello, Shoppie!

Your order has been successfully placed.

Order ID: ${order.id}
Order Status: ${order.status}
Payment Status: ${order.paymentStatus}

Total Amount: ₹${Number(order.totalAmount).toFixed(2)}

Delivery Address:
${order.deliveryAddress}
${order.deliveryCity}, ${order.deliveryState}
${order.deliveryPincode}

We will keep you updated as your order progresses.

Thank you,
Hello, Shoppie!
    `;


    const html = `
        <div style="
            font-family: Arial, sans-serif;
            max-width: 700px;
            margin: 0 auto;
            padding: 24px;
            color: #222;
        ">

            <h1 style="margin-bottom: 8px;">
                🛍️ Hello, Shoppie!
            </h1>

            <h2>
                Order Confirmed 🎉
            </h2>

            <p>
                Hi <strong>${customerName}</strong>,
            </p>

            <p>
                Thank you for shopping with
                <strong>Hello, Shoppie!</strong>
            </p>

            <p>
                Your order has been successfully placed.
            </p>


            <div style="
                background: #f7f7f7;
                padding: 16px;
                border-radius: 8px;
                margin: 20px 0;
            ">

                <p>
                    <strong>Order ID:</strong>
                    ${order.id}
                </p>

                <p>
                    <strong>Order Status:</strong>
                    ${order.status}
                </p>

                <p>
                    <strong>Payment Status:</strong>
                    ${order.paymentStatus}
                </p>

            </div>


            <h3>Order Items</h3>

            <table style="
                width: 100%;
                border-collapse: collapse;
            ">

                <thead>
                    <tr>
                        <th style="padding: 10px; text-align: left;">
                            Product
                        </th>

                        <th style="padding: 10px; text-align: center;">
                            Qty
                        </th>

                        <th style="padding: 10px; text-align: right;">
                            Price
                        </th>

                        <th style="padding: 10px; text-align: right;">
                            Subtotal
                        </th>
                    </tr>
                </thead>

                <tbody>
                    ${orderItems}
                </tbody>

            </table>


            <div style="
                text-align: right;
                margin-top: 20px;
                font-size: 18px;
            ">

                <strong>
                    Total: ₹${Number(order.totalAmount).toFixed(2)}
                </strong>

            </div>


            <h3 style="margin-top: 30px;">
                Delivery Address
            </h3>

            <p>
                ${order.deliveryAddress}<br>
                ${order.deliveryCity},
                ${order.deliveryState}<br>
                ${order.deliveryPincode}
            </p>


            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />


            <p style="color: #777;">
                We'll keep you updated when your order status changes.
            </p>

            <p>
                Thank you for choosing
                <strong>Hello, Shoppie!</strong> 🛍️
            </p>

        </div>
    `;


    return sendEmail({
        to: customerEmail,
        subject,
        text,
        html,
    });
};

const sendOrderStatusEmail = async (order) => {
    const customerEmail = order.user?.email;

    if (!customerEmail) {
        console.warn(
            "⚠️ Order status email skipped: customer email not found."
        );

        return {
            success: false,
            skipped: true,
            reason: "Customer email not found",
        };
    }

    const customerName =
        order.customerName ||
        order.user?.name ||
        "Customer";

    const statusMessages = {
        CONFIRMED: {
            subject: "Your order has been confirmed",
            title: "Your Order Has Been Confirmed ✅",
            message:
                "Great news! Your order has been confirmed by the seller and will be processed soon.",
        },

        PROCESSING: {
            subject: "Your order is being processed",
            title: "Your Order Is Being Processed 🔄",
            message:
                "We've started processing your order and will keep you updated.",
        },

        SHIPPED: {
            subject: "Your order has been shipped",
            title: "Your Order Has Been Shipped 🚚",
            message:
                "Great news! Your order is on its way.",
        },

        DELIVERED: {
            subject: "Your order has been delivered",
            title: "Your Order Has Been Delivered ✅",
            message:
                "Your order has been successfully delivered. We hope you enjoy your purchase!",
        },

        CANCELLED: {
            subject: "Your order has been cancelled",
            title: "Your Order Has Been Cancelled ❌",
            message:
                "Your order has been cancelled. If you believe this happened by mistake, please contact support.",
        },
    };

    const statusInfo = statusMessages[order.status];

    if (!statusInfo) {
        console.log(
            `ℹ️ No email configured for order status: ${order.status}`
        );

        return {
            success: false,
            skipped: true,
            reason: `No email template for status ${order.status}`,
        };
    }

    const subject =
        `${statusInfo.subject} — #${order.id}`;

    const text = `
Hello ${customerName},

${statusInfo.message}

Order ID: ${order.id}
Current Status: ${order.status}
Total Amount: ₹${Number(order.totalAmount).toFixed(2)}

Thank you,
Hello, Shoppie!
    `;

    const html = `
        <div style="
            font-family: Arial, sans-serif;
            max-width: 700px;
            margin: 0 auto;
            padding: 24px;
            color: #222;
        ">

            <h1>
                🛍️ Hello, Shoppie!
            </h1>

            <h2>
                ${statusInfo.title}
            </h2>

            <p>
                Hi <strong>${customerName}</strong>,
            </p>

            <p>
                ${statusInfo.message}
            </p>

            <div style="
                background: #f7f7f7;
                padding: 16px;
                border-radius: 8px;
                margin: 20px 0;
            ">

                <p>
                    <strong>Order ID:</strong>
                    ${order.id}
                </p>

                <p>
                    <strong>Current Status:</strong>
                    ${order.status}
                </p>

                <p>
                    <strong>Total Amount:</strong>
                    ₹${Number(order.totalAmount).toFixed(2)}
                </p>

            </div>

            <p>
                Thank you for choosing
                <strong>Hello, Shoppie!</strong> 🛍️
            </p>

        </div>
    `;

    return sendEmail({
        to: customerEmail,
        subject,
        text,
        html,
    });
};

module.exports = {
    sendEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusEmail,
};