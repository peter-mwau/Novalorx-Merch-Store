import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


const sendEmail = async (req, res) => {
    const { from, to, subject, text, html } = req.body;

    console.log("Body received for sending email:", { from, to, subject, text, html });

    if (!from || !to || !subject || (!text && !html)) {
        return res.status(400).json({ error: "Missing required fields: from, to, subject, and either text or html" });
    }

    if (typeof from !== "string" || !from.includes("@")) {
        return res.status(400).json({ error: "Invalid 'from' field. It must be an email address." });
    }

    try {
        const info = await transporter.sendMail({
            from: from,
            to,
            subject: subject, // subject line
            text: text, // plain text body
            html: html, // HTML body
        });

        console.log("Email sent successfully:", info);
        return res.status(200).json({ message: "Email sent successfully", info });
    } catch (err) {
        console.error("Error while sending mail:", err);
        return res.status(500).json({ error: "Error while sending email" });
    }
};

export default sendEmail;