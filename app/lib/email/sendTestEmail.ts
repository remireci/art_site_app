import nodemailer from "nodemailer";

type SendEmailResult =
  | { success: true; messageId: string }
  | { success: false; error: string };

export async function sendTestEmail(): Promise<SendEmailResult> {
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
    <p>You have been invited to manage your institution's exhibitions. Click the link below to create your account:</p>
    <p><a href="https://www.artnowdatabase.eu/auth/register?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpcmtfbWVydGVuc0BmYXN0bWFpbC5mbSIsImlhdCI6MTc0NzI5ODUxNiwiZXhwIjoxNzQ3MzA1NzE2fQ.gVX22H9DFFFKSmKSTzWgRbF0c1rbFndjyNZ4Th9SCMI"</a></p>
  `;

    const to = "reci.reciproque@gmail.com";

    const info = await transporter.sendMail({
      from: `"Art Now Database" <${process.env.SMTP_USER}>`,
      to,
      subject: "Create your account",
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
}
