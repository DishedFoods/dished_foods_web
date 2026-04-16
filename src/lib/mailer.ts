/**
 * Thin wrapper around nodemailer.
 *
 * - When SMTP_HOST is set: sends real email via the configured SMTP server.
 * - When SMTP_HOST is blank (local dev): skips sending and logs the reset
 *   link to the server console so you can test without an email provider.
 */

import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST ?? "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "465", 10);
const SMTP_SECURE = process.env.SMTP_SECURE !== "false"; // default true
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_PASS = process.env.SMTP_PASS ?? "";
const SMTP_FROM = process.env.SMTP_FROM ?? '"Dished" <noreply@dished.ca>';

function createTransport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export interface ResetEmailOptions {
  to: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: ResetEmailOptions): Promise<void> {
  const subject = "Reset your Dished password";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0faf8;font-family:'DM Sans',system-ui,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0faf8;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #aee3d6">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4d9e8a,#3a8273);padding:32px 40px;text-align:center">
            <p style="margin:0;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px">Dished</p>
            <p style="margin:6px 0 0;font-size:11px;color:#d6f0e9;font-weight:700;letter-spacing:0.15em;text-transform:uppercase">Canada's Home Kitchen</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px">
            <h1 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#1a2b28">Reset your password</h1>
            <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6">
              We received a request to reset the password for your Dished chef account.
              Click the button below to choose a new password.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 24px">
              <tr>
                <td style="background:#4d9e8a;border-radius:12px;box-shadow:0 3px 0 #2a6155">
                  <a href="${resetUrl}"
                     style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none">
                    Reset Password
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 8px;font-size:13px;color:#64748b">
              Or copy and paste this URL into your browser:
            </p>
            <p style="margin:0 0 24px;font-size:12px;color:#4d9e8a;word-break:break-all">
              <a href="${resetUrl}" style="color:#4d9e8a">${resetUrl}</a>
            </p>
            <hr style="border:none;border-top:1px solid #e8f6f2;margin:0 0 24px">
            <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6">
              This link expires in <strong>1 hour</strong>. If you didn't request a password reset,
              you can safely ignore this email — your password won't change.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fffe;padding:20px 40px;text-align:center;border-top:1px solid #e8f6f2">
            <p style="margin:0;font-size:12px;color:#94a3b8">
              © ${new Date().getFullYear()} Dished Inc. · Canada's Home Kitchen Marketplace
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Reset your Dished password\n\nClick the link below to reset your password (expires in 1 hour):\n\n${resetUrl}\n\nIf you didn't request this, ignore this email.`;

  if (!SMTP_HOST) {
    // Dev fallback — no email provider configured
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧  PASSWORD RESET LINK (SMTP not configured)");
    console.log("    To:", to);
    console.log("    URL:", resetUrl);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    return;
  }

  const transporter = createTransport();
  await transporter.sendMail({ from: SMTP_FROM, to, subject, html, text });
}
