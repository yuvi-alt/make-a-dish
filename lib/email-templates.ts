export function getAdminNotificationHTML(registrationData: {
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
}): string {
  const addressParts = [
    registrationData.addressLine1,
    registrationData.addressLine2,
    registrationData.city,
    registrationData.county,
    registrationData.country,
    registrationData.postcode,
  ].filter(Boolean);

  const detailDataStr = JSON.stringify(registrationData.detailData, null, 2);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Registration Received</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0;">New Registration Received</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
    <p style="font-size: 16px; margin-top: 0;">A new food business registration has been submitted.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #ff6b35; margin-top: 0; font-size: 18px;">Registration Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 40%;">Registration ID:</td>
          <td style="padding: 8px 0;">${registrationData.registrationId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Submitted:</td>
          <td style="padding: 8px 0;">${new Date(registrationData.submittedAt).toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${registrationData.email}" style="color: #ff6b35;">${registrationData.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Entity Type:</td>
          <td style="padding: 8px 0;">${registrationData.entityType}</td>
        </tr>
      </table>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #ff6b35; margin-top: 0; font-size: 18px;">Business Address</h2>
      <p style="margin: 0; white-space: pre-line;">${addressParts.join("\n")}</p>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #ff6b35; margin-top: 0; font-size: 18px;">Business Details</h2>
      <pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin: 0;">${detailDataStr}</pre>
    </div>
  </div>
  
  <div style="background: #f0f0f0; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
    <p style="margin: 0;">This is an automated notification from the Food Business Registration System.</p>
  </div>
</body>
</html>
  `.trim();
}

export function getUserConfirmationHTML(registrationData: {
  registrationId: string;
  postcode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  country: string;
  entityType: string;
  submittedAt: string;
}): string {
  const addressParts = [
    registrationData.addressLine1,
    registrationData.addressLine2,
    registrationData.city,
    registrationData.county,
    registrationData.country,
    registrationData.postcode,
  ].filter(Boolean);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0;">Thank You for Registering!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
    <p style="font-size: 16px; margin-top: 0;">Your registration has been successfully submitted and we have sent your details to the relevant local authority.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #ff6b35; margin-top: 0; font-size: 18px;">Registration Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 40%;">Registration ID:</td>
          <td style="padding: 8px 0; font-family: monospace;">${registrationData.registrationId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Submitted:</td>
          <td style="padding: 8px 0;">${new Date(registrationData.submittedAt).toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Entity Type:</td>
          <td style="padding: 8px 0;">${registrationData.entityType}</td>
        </tr>
      </table>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #ff6b35; margin-top: 0; font-size: 18px;">Business Address</h2>
      <p style="margin: 0; white-space: pre-line;">${addressParts.join("\n")}</p>
    </div>

    <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
      <p style="margin: 0; font-size: 14px;">
        <strong>What happens next?</strong><br>
        You only need to register your food business once, unless any of your details change. The local authority will be in touch if they need more information.
      </p>
    </div>
  </div>
  
  <div style="background: #f0f0f0; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
    <p style="margin: 0;">If you have any questions, please contact your local authority directly.</p>
    <p style="margin: 10px 0 0 0;"><strong>The Registration Team</strong></p>
  </div>
</body>
</html>
  `.trim();
}

