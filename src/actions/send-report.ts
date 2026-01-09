"use server"

import nodemailer from "nodemailer"

interface SendReportData {
    reason: string
    description: string
    email: string
    contentId: string
    contentName: string
    contentCreator?: string
    contentType: string
}

export async function sendReport(data: SendReportData) {
    const { reason, description, email, contentId, contentName, contentCreator, contentType } = data

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
            from: process.env.REPORT_FROM_EMAIL || process.env.SMTP_USER,
            to: process.env.REPORT_TO_EMAIL || "mediolano.dao@example.com", // Fallback or strict requirement
            subject: `[REPORT] ${contentType.toUpperCase()}: ${contentName} - ${reason}`,
            html: `
        <h1>New Content Report</h1>
        <p><strong>Content Type:</strong> ${contentType}</p>
        <p><strong>Content Name:</strong> ${contentName}</p>
        <p><strong>Content ID:</strong> ${contentId}</p>
        ${contentCreator ? `<p><strong>Creator:</strong> ${contentCreator}</p>` : ""}
        <hr />
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Description:</strong></p>
        <p style="white-space: pre-wrap;">${description}</p>
        <hr />
        <p><strong>Reporter Email:</strong> ${email || "Not provided"}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
        }

        await transporter.sendMail(mailOptions)
        return { success: true }
    } catch (error) {
        console.error("Failed to send report email:", error)
        return { success: false, error: "Failed to send report. Please try again later." }
    }
}
