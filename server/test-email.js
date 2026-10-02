require("dotenv").config();

const { sendEmail } = require("./src/modules/notification/notification.service");

const testEmail = async () => {
    try {
        await sendEmail({
            to: process.env.SMTP_USER,

            subject: "Hello, Shoppie! — Email Test",

            text: "This is a test email from the Hello, Shoppie! backend.",

            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>🛍️ Hello, Shoppie!</h2>

                    <p>
                        This is a test email from your
                        <strong>Hello, Shoppie!</strong> backend.
                    </p>

                    <p>
                        ✅ Gmail SMTP is working correctly.
                    </p>

                    <hr />

                    <p style="color: #777;">
                        This is an automated test email.
                    </p>
                </div>
            `,
        });

        console.log("✅ Test email completed successfully.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Test email failed.");
        console.error(error.message);

        process.exit(1);
    }
};

testEmail();