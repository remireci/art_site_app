// TODO sendTestEmail is used for sending an email to art now database
// when a user tries to signup but their institution is not in the database
// So we could re-name this function accordingly?

import nodemailer from "nodemailer";

type SendEmailResult =
  | { success: true; messageId: string }
  | { success: false; error: string };

export async function sendTestEmail(
  email: string | null
): Promise<SendEmailResult> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true, // STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const html = `
<p>Hello,</p>
<p>A user with the email address <strong>${email}</strong> attempted to sign up, but their institution's domain was not found in the database.</p>
<p>Please review the institution associated with this domain and determine whether it should be added to the system. Once a decision has been made, kindly inform the user.</p>
<p>Thank you,<br/>Art Now Web App</p>

  `;

    const to = "info@artnowdatabase.eu";

    const info = await transporter.sendMail({
      from: `"Art Now Database" <${process.env.SMTP_USER}>`,
      to,
      subject: "Request to review a new institution",
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
}
