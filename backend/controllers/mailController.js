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
    const { name, email, cc, subject, message } = req.body;

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof message !== "string" ||
        !name.trim() ||
        !email.trim() ||
        !message.trim()
    ) {
        return res.status(400).json({ error: "Name, email, and message are required" });
    }

    if (!email.includes("@")) {
        return res.status(400).json({ error: "Invalid email address" });
    }

    if (cc !== undefined && cc !== null && (typeof cc !== "string" || !cc.includes("@"))) {
        return res.status(400).json({ error: "Invalid CC email address" });
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            replyTo: email,
            ...(cc?.trim() ? { cc: cc.trim() } : {}),
            subject: typeof subject === "string" && subject.trim()
                ? subject.trim()
                : `Contact form message from ${name.trim()}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        });

        console.log("Email sent successfully:", info);
        return res.status(200).json({ message: "Email sent successfully", info });
    } catch (err) {
        console.error("Error while sending mail:", err);
        return res.status(500).json({ error: "Error while sending email" });
    }
};

export default sendEmail;