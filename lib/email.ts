import nodemailer from "nodemailer";
import { getAdminNotificationHTML, getUserConfirmationHTML } from "./email-templates";

const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
// Use ADMIN_NOTIFICATION_EMAIL if set, otherwise fall back to ADMIN_EMAIL
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

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
    throw new Error("ADMIN_NOTIFICATION_EMAIL or ADMIN_EMAIL environment variable is not set");
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
    subject: "New Make a Dish registration submitted",
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
  detailData?: unknown;
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

  // Helper to extract business name from detail data
  const getBusinessName = (detailData: unknown, entityType: string): string => {
    if (!detailData || typeof detailData !== "object") return "";
    const data = detailData as Record<string, unknown>;
    if (entityType === "limited-company" && typeof data.companyName === "string") {
      return data.companyName;
    }
    if (entityType === "organisation" && typeof data.trustName === "string") {
      return data.trustName;
    }
    if (entityType === "sole-trader") {
      const firstName = typeof data.firstName === "string" ? data.firstName : "";
      const lastName = typeof data.lastName === "string" ? data.lastName : "";
      return [firstName, lastName].filter(Boolean).join(" ") || "";
    }
    if (entityType === "partnership" && typeof data.mainContact === "string") {
      return data.mainContact;
    }
    return "";
  };

  const businessName = registrationData.detailData 
    ? getBusinessName(registrationData.detailData, registrationData.entityType)
    : "";

  const htmlBody = getUserConfirmationHTML(registrationData);
  const textBody = `
Thank you for registering your food business with us.

Your registration has been successfully submitted and we have sent your details to the relevant local authority.

Registration Details:
${businessName ? `- Business Name: ${businessName}\n` : ""}- Registration ID: ${registrationData.registrationId}
- Submitted: ${new Date(registrationData.submittedAt).toLocaleString()}
- Entity Type: ${registrationData.entityType}
- Postcode: ${registrationData.postcode}

Business Address:
${addressParts.join("\n")}

You only need to register your food business once, unless any of your details change. The local authority will be in touch if they need more information.

If you have any questions, please contact your local authority directly.

Best regards,
The Registration Team
`;

  const info = await transporter.sendMail({
    from: emailUser,
    to: userEmail,
    subject: "We've received your Make a Dish registration",
    text: textBody,
    html: htmlBody,
  });

  console.log("✅ User confirmation email sent successfully:", {
    messageId: info.messageId,
    to: userEmail,
  });
}

