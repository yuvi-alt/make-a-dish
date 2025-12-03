import nodemailer from "nodemailer";
import { getAdminNotificationHTML, getUserConfirmationHTML } from "./email-templates";

const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const adminEmail = process.env.ADMIN_EMAIL;

function getTransporter() {
  if (!emailHost || !emailUser || !emailPass) {
    throw new Error("Email configuration is missing. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.");
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

export async function sendAdminNotification(registrationData: {
  registrationId: string;
  email: string;
  postcode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  country: string;
  entityType: string;
  detailData: unknown;
  submittedAt: string;
}) {
  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL environment variable is not set");
  }

  const transporter = getTransporter();

  const addressParts = [
    registrationData.addressLine1,
    registrationData.addressLine2,
    registrationData.city,
    registrationData.county,
    registrationData.country,
    registrationData.postcode,
  ].filter(Boolean);

  const htmlBody = getAdminNotificationHTML(registrationData);
  const textBody = `
A new food business registration has been submitted.

Registration ID: ${registrationData.registrationId}
Submitted: ${new Date(registrationData.submittedAt).toLocaleString()}

Contact Information:
- Email: ${registrationData.email}

Address:
${addressParts.join("\n")}

Legal Entity Type: ${registrationData.entityType}

Business Details:
${JSON.stringify(registrationData.detailData, null, 2)}
`;

  const info = await transporter.sendMail({
    from: emailUser,
    to: adminEmail,
    subject: "New registration received",
    text: textBody,
    html: htmlBody,
  });

  console.log("✅ Admin notification email sent successfully:", {
    messageId: info.messageId,
    to: adminEmail,
    registrationId: registrationData.registrationId,
  });
}

export async function sendUserConfirmation(userEmail: string, registrationData: {
  registrationId: string;
  postcode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  country: string;
  entityType: string;
  submittedAt: string;
}) {
  const transporter = getTransporter();

  const addressParts = [
    registrationData.addressLine1,
    registrationData.addressLine2,
    registrationData.city,
    registrationData.county,
    registrationData.country,
    registrationData.postcode,
  ].filter(Boolean);

  const htmlBody = getUserConfirmationHTML(registrationData);
  const textBody = `
Thank you for registering your food business with us.

Your registration has been successfully submitted and we have sent your details to the relevant local authority.

Registration Details:
- Registration ID: ${registrationData.registrationId}
- Submitted: ${new Date(registrationData.submittedAt).toLocaleString()}

Business Address:
${addressParts.join("\n")}

Legal Entity Type: ${registrationData.entityType}

You only need to register your food business once, unless any of your details change. The local authority will be in touch if they need more information.

If you have any questions, please contact your local authority directly.

Best regards,
The Registration Team
`;

  const info = await transporter.sendMail({
    from: emailUser,
    to: userEmail,
    subject: "Thanks for registering your food business",
    text: textBody,
    html: htmlBody,
  });

  console.log("✅ User confirmation email sent successfully:", {
    messageId: info.messageId,
    to: userEmail,
  });
}

