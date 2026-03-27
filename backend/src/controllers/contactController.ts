import { Request, Response } from "express";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import Contact from "../models/Contact";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
    family: 4, // Force IPv4 — Render free tier doesn't route IPv6
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  } as SMTPTransport.Options);

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;
    const ip = req.ip ?? "unknown";

    // Save to MongoDB
    await Contact.create({ name, email, subject, message, ip });

    // Send email notification (non-blocking — fail silently if not configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to: process.env.RECEIVER_EMAIL ?? process.env.EMAIL_USER,
          replyTo: email,
          subject: `[Portfolio] ${subject} — from ${name}`,
          html: `
            <div style="font-family: monospace; background: #0a0a0a; color: #f5f5f5; padding: 32px; border-radius: 4px;">
              <h2 style="color: #FB460D; margin: 0 0 24px;">New Message from Portfolio</h2>
              <table style="border-collapse: collapse; width: 100%;">
                <tr><td style="padding: 8px 0; color: #888; width: 100px;">Name</td><td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
                <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #FB460D;">${escapeHtml(email)}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #888;">Subject</td><td style="padding: 8px 0;">${escapeHtml(subject)}</td></tr>
              </table>
              <div style="margin-top: 24px; padding: 20px; background: #111; border-left: 3px solid #FB460D;">
                <p style="white-space: pre-wrap; margin: 0; line-height: 1.7;">${escapeHtml(message)}</p>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Email send failed (non-fatal):", emailErr);
      }
    }

    res.status(201).json({
      success: true,
      message: "Message received! I'll get back to you soon.",
    });
  } catch (err) {
    console.error("Contact submission error:", err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
