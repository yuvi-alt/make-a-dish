# Email Troubleshooting Guide

## Issue: Not Receiving Emails in Gmail

If you're not receiving email notifications when someone registers, follow these steps:

### 1. Check Environment Variables

Make sure your `.env.local` file has all required email variables:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
ADMIN_EMAIL=your-email@gmail.com
```

**Important:** 
- `EMAIL_USER` = Your Gmail address
- `EMAIL_PASS` = Gmail App Password (NOT your regular Gmail password)
- `ADMIN_EMAIL` = Where you want to receive admin notifications

### 2. Generate Gmail App Password

Gmail requires an "App Password" for third-party apps:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App Passwords** section
4. Create a new app password for "Mail"
5. Copy the 16-character password (no spaces)
6. Use it in `EMAIL_PASS` in your `.env.local`

### 3. Test Email Configuration

1. Go to `/admin/test-email` in your browser
2. Click "Send Test Email"
3. Check the results:
   - ✅ Green = Email sent successfully
   - ❌ Red = Check error message

### 4. Check Server Logs

When a registration is submitted, check your terminal/console for:

- ✅ `Email sent successfully` messages
- ❌ `Failed to send admin notification:` errors

If you see errors, they'll show what's wrong (e.g., "Email configuration is missing").

### 5. Check Spam Folder

Sometimes emails end up in:
- Spam/Junk folder
- Promotions tab (Gmail)
- All Mail folder

### 6. Verify Email Settings

**For Gmail:**
- `EMAIL_HOST=smtp.gmail.com`
- `EMAIL_PORT=587`
- Use App Password, not regular password

**For Other Providers:**
- Outlook: `smtp-mail.outlook.com`, port `587`
- Yahoo: `smtp.mail.yahoo.com`, port `587`

### 7. Common Issues

**Issue: "Email configuration is missing"**
- Solution: Check all environment variables are set

**Issue: "Invalid login" or "Authentication failed"**
- Solution: Use App Password, not regular password

**Issue: "Connection timeout"**
- Solution: Check firewall/network settings

**Issue: Emails sent but not received**
- Solution: Check spam folder, verify ADMIN_EMAIL is correct

### 8. Debug Steps

1. ✅ Verify environment variables are loaded (restart dev server)
2. ✅ Test email configuration using `/admin/test-email`
3. ✅ Check server logs when submitting registration
4. ✅ Verify ADMIN_EMAIL matches your Gmail address
5. ✅ Check spam folder

### 9. For Vercel Deployment

Add all environment variables in Vercel dashboard:
- Settings → Environment Variables
- Add each variable for Production, Preview, and Development
- **Redeploy** after adding variables

### Still Not Working?

1. Check server logs in terminal for detailed error messages
2. Try the test email page at `/admin/test-email`
3. Verify Gmail App Password is correct
4. Make sure 2-Step Verification is enabled in Google Account

## Need Help?

Check the console/terminal logs - they now show detailed error messages when email sending fails.

