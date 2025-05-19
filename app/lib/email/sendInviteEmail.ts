import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendInviteEmail(to: string, token: string) {
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register?token=${token}`;

  const html = `
    <p>Hello,</p>
    <p>You have been invited to manage your institution's exhibitions on ArtNowDatabase. Click the link below to create your account:</p>
    <p><a href="${link}">${link}</a></p>
    <p>If you weren’t expecting this invitation, you can safely ignore this email.</p>
    <p>Best regards,  </p>
    <p>The ArtNow Team</p>

  `;

  await transporter.sendMail({
    from: `"Art Now Database" <${process.env.SMTP_USER}>`,
    to,
    subject: "You’re invited to manage exhibitions on ArtNowDatabase",
    html,
  });
}
