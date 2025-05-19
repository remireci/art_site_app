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

export async function sendCodeEmail(to: string, code: string) {
  const html = `
<p>Hello,</p>
<p>Thanks for joining us at Art Now Database!</p>
<p>Your one-time login code is: <strong>${code}</strong></p>
<p>This code will expire in 10 minutes. Just enter it on the site to access your account.</p>
<p>If you didn’t request this, feel free to ignore the email.</p>
<p>Warm regards,<br />The Art Now Database Team</p>
  `;

  await transporter.sendMail({
    from: `"Art Now Database" <${process.env.SMTP_USER}>`,
    to,
    subject: `Your login code ${code}`,
    html,
  });
}
