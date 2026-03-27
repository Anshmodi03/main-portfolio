import { Request, Response } from "express";
import { Resend } from "resend";
import Contact from "../models/Contact";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const emailHtml = (name: string, email: string, subject: string, message: string) => `
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
`;

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;
    const ip = req.ip ?? "unknown";

    // Save to MongoDB
    await Contact.create({ name, email, subject, message, ip });

    // Send email via Resend (HTTP API — works on Render free tier, no SMTP needed)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.EMAIL_FROM ?? "Portfolio Contact <onboarding@resend.dev>",
          to: process.env.RECEIVER_EMAIL ?? "",
          replyTo: email,
          subject: `[Portfolio] ${subject} — from ${name}`,
          html: emailHtml(name, email, subject, message),
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
