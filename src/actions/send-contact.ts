"use server"

import nodemailer from "nodemailer"

interface SendContactData {
    subject: string
    name: string
    email: string
    message: string
}

export async function sendContact(data: SendContactData) {
    const { subject, name, email, message } = data

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    try {
        const mailOptions = {
            from: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER,
            to: process.env.CONTACT_TO_EMAIL || "mediolano.dao@example.com", // Fallback
            replyTo: email,
            subject: `[CONTACT] ${subject} - from ${name}`,
            html: `
        <h1>New Contact Message</h1>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr />
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
        }

        await transporter.sendMail(mailOptions)
        return { success: true }
    } catch (error) {
        console.error("Failed to send contact email:", error)
        return { success: false, error: "Failed to send message. Please try again later." }
    }
}
