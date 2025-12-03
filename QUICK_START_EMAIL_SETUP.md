# Quick Start - Email & Admin Setup

## Environment Variables Setup

Add these to your `.env.local` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@example.com

# Admin Password
ADMIN_PASSWORD=your-secure-password-here
```

## Gmail Setup Example

If using Gmail:
1. Enable 2-factor authentication
2. Generate an "App Password" (not your regular password)
3. Use:
   - `EMAIL_HOST=smtp.gmail.com`
   - `EMAIL_PORT=587`
   - `EMAIL_USER=your-email@gmail.com`
   - `EMAIL_PASS=your-app-password-here`

## Testing

1. **Test Email Field:**
   - Go to `/register/start`
   - Email field should appear before address search
   - Try submitting without email - should show validation error

2. **Test Registration:**
   - Complete a full registration
   - Check admin email inbox for notification
   - Check user email inbox for confirmation

3. **Test Admin Dashboard:**
   - Go to `/admin/login`
   - Enter your `ADMIN_PASSWORD`
   - Should redirect to `/admin/registrations`
   - Should see list of all registrations

## Vercel Deployment

Add all environment variables in Vercel dashboard:
- Settings → Environment Variables
- Add each variable
- **Redeploy** after adding

## Troubleshooting

**Emails not sending?**
- Check SMTP credentials are correct
- Check spam folder
- Check server logs for errors
- Verify EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS are set

**Admin login not working?**
- Make sure ADMIN_PASSWORD is set in environment variables
- Clear cookies and try again
- Check server logs

**Can't see registrations in admin?**
- Make sure registrations exist (complete at least one registration)
- Check that final.json files exist in storage

