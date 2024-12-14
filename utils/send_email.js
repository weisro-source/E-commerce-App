const nodemailer = require('nodemailer');

// Nodemailer
const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOpts = {
            from: 'E-shop App <your_email@gmail.com>',
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        await transporter.sendMail(mailOpts);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email: ", error.message);
        throw new Error("Failed to send email");
    }
};
module.exports = sendEmail;

