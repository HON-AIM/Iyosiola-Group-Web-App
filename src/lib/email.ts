import nodemailer from "nodemailer";

function validateEmailConfig(): void {
  const requiredEnvVars = [
    "EMAIL_SERVER_HOST",
    "EMAIL_SERVER_PORT",
    "EMAIL_SERVER_USER",
    "EMAIL_SERVER_PASSWORD",
    "EMAIL_FROM",
  ];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      console.warn(`[WARN] Missing environment variable: ${varName}`);
    }
  }
}

validateEmailConfig();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.example.com",
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendVerificationEmail(email: string, name: string, verificationLink: string) {
  const safeName = escapeHtml(name || "User");

  await transporter.sendMail({
    from: `"Iyosi Foods" <${process.env.EMAIL_FROM || "noreply@iyosifoods.com"}>`,
    to: email,
    subject: "Verify your email address - Iyosi Foods",
    text: `Welcome to Iyosi Foods, ${safeName}!\n\nPlease verify your email by visiting: ${verificationLink}\n\nThis link expires in 24 hours.\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333;">Welcome to Iyosi Foods, ${safeName}!</h2>
        <p style="color: #555;">Please confirm your email address to activate your account and access your dashboard.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p style="color: #888; font-size: 12px;">This link expires in 24 hours. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, name: string, resetLink: string) {
  const safeName = escapeHtml(name || "User");

  await transporter.sendMail({
    from: `"Iyosi Foods" <${process.env.EMAIL_FROM || "noreply@iyosifoods.com"}>`,
    to: email,
    subject: "Reset your password - Iyosi Foods",
    text: `Reset Your Password\n\nHello ${safeName},\n\nWe received a request to reset the password for your Iyosi Foods account.\n\nClick the link below to reset your password (expires in 1 hour):\n${resetLink}\n\nIf you didn't request a new password, you can safely ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p style="color: #555; font-size: 16px;">Hello ${safeName},</p>
        <p style="color: #555; font-size: 16px;">We received a request to reset the password for your Iyosi Foods account associated with this email address.</p>
        <p style="color: #555; font-size: 16px;">You can reset your password by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #16a34a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #888; font-size: 14px; text-align: center;">This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="color: #888; font-size: 12px; text-align: center;">If you didn't request a new password, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendOrderStatusUpdate(
  email: string,
  orderId: string,
  oldStatus: string,
  newStatus: string,
  customerName?: string,
  reason?: string
) {
  const safeName = escapeHtml(customerName || "Customer");
  const safeReason = reason ? escapeHtml(reason) : "";

  const statusMessages: Record<string, { text: string; color: string }> = {
    PENDING: { text: "Pending", color: "#f59e0b" },
    PAID: { text: "Paid", color: "#10b981" },
    PROCESSING: { text: "Processing", color: "#3b82f6" },
    SHIPPED: { text: "Shipped", color: "#8b5cf6" },
    DELIVERED: { text: "Delivered", color: "#22c55e" },
    CANCELLED: { text: "Cancelled", color: "#ef4444" },
  };

  const oldStatusInfo = statusMessages[oldStatus] || { text: oldStatus, color: "#6b7280" };
  const newStatusInfo = statusMessages[newStatus] || { text: newStatus, color: "#6b7280" };

  await transporter.sendMail({
    from: `"Iyosi Foods" <${process.env.EMAIL_FROM || "noreply@iyosifoods.com"}>`,
    to: email,
    subject: `Order Update: ${newStatusInfo.text} - Order #${orderId.slice(0, 8)}`,
    text: `Order Status Update\n\nHello ${safeName},\n\nYour order #${orderId} has been updated.\n\nStatus: ${oldStatusInfo.text} → ${newStatusInfo.text}${safeReason ? `\nReason: ${safeReason}` : ""}\n\nThank you for shopping with Iyosi Foods!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Order Status Update</h2>
        <p style="color: #555;">Hello ${safeName},</p>
        <p style="color: #555;">Your order <strong>#${orderId.slice(0, 8)}</strong> has been updated:</p>
        <div style="text-align: center; padding: 20px; background-color: #f9f9f9; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Status Change</p>
          <p style="margin: 0; font-size: 18px;">
            <span style="color: ${oldStatusInfo.color}; font-weight: bold;">${oldStatusInfo.text}</span>
            <span style="margin: 0 10px; color: #999;">→</span>
            <span style="color: ${newStatusInfo.color}; font-weight: bold;">${newStatusInfo.text}</span>
          </p>
          ${safeReason ? `<p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">Reason: ${safeReason}</p>` : ""}
        </div>
        <p style="color: #888; font-size: 12px; text-align: center;">Thank you for shopping with Iyosi Foods!</p>
      </div>
    `,
  });
}

export async function sendAdminDirectMessage(
  email: string,
  subject: string,
  content: string
) {
  const safeSubject = escapeHtml(subject);
  const safeContent = escapeHtml(content).replace(/\n/g, "<br />");

  await transporter.sendMail({
    from: `"Iyosi Foods" <${process.env.EMAIL_FROM || "admin@iyosifoods.com"}>`,
    to: email,
    subject: safeSubject,
    text: `A message from the Iyosi Foods Team:\n\n${content}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
           <h2 style="color: #2c3e50; margin: 0;">Iyosi Foods</h2>
           <p style="color: #7f8c8d; font-size: 14px; margin-top: 5px;">A message from our team</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; color: #333; line-height: 1.6;">
          ${safeContent}
        </div>
        
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">
          This email was sent by the Iyosi Foods Admin. Please do not reply directly to this email unless specifically instructed.
        </p>
      </div>
    `,
  });
}

interface SendEmailOptions {
  to: string;
  subject: string;
  template: "email-verification" | "password-reset" | "contact-confirmation" | "admin-message";
  data: Record<string, string>;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const { to, subject, template, data } = options;

  switch (template) {
    case "email-verification":
      await sendVerificationEmail(
        to,
        data.name || "User",
        data.verificationLink || ""
      );
      break;
    case "password-reset":
      await sendPasswordResetEmail(
        to,
        data.name || "User",
        data.resetLink || ""
      );
      break;
    case "contact-confirmation":
      await transporter.sendMail({
        from: `"Iyosi Foods" <${process.env.EMAIL_FROM || "noreply@iyosifoods.com"}>`,
        to,
        subject: "We received your message - Iyosi Foods",
        text: `Thank you for contacting Iyosi Foods!\n\nWe have received your message and will get back to you within 24 business hours.\n\nYour submitted message:\n${data.message || ""}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #333;">Thank You for Contacting Us!</h2>
            <p style="color: #555;">We have received your message and will get back to you within 24 business hours.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #666; font-size: 14px;"><strong>Subject:</strong> ${escapeHtml(data.subject || "")}</p>
              <p style="color: #666; font-size: 14px;"><strong>Message:</strong></p>
              <p style="color: #333;">${escapeHtml(data.message || "").replace(/\n/g, "<br />")}</p>
            </div>
            <p style="color: #888; font-size: 12px;">If you have any urgent inquiries, please call us at +234 800 IYOSI.</p>
          </div>
        `,
      });
      break;
    case "admin-message":
      await sendAdminDirectMessage(to, subject, data.content || "");
      break;
    default:
      throw new Error(`Unknown email template: ${template}`);
  }
}
