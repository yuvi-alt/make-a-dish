# Admin Page Access Guide

## How to Access Admin Pages After Deployment

### 1. Admin Login URL

After deployment, access the admin login page at:

```
https://your-domain.vercel.app/admin/login
```

Replace `your-domain.vercel.app` with your actual Vercel domain.

### 2. Login Process

1. **Go to the login page:**
   - Visit: `https://your-domain.vercel.app/admin/login`

2. **Enter your admin email:**
   - Use the email address that matches your `ADMIN_EMAIL` environment variable
   - Example: If `ADMIN_EMAIL=yuvraj.bhawsar@gmail.com`, use that email

3. **Click "Login"**
   - No password needed - just your email address
   - You'll be redirected to the admin dashboard

### 3. Available Admin Pages

Once logged in, you can access:

- **Admin Dashboard:** `/admin/registrations`
  - View all registrations
  - Search registrations
  - Delete registrations

- **Registration Details:** `/admin/registrations/[id]`
  - View full details of a specific registration
  - Delete individual registrations

- **Test Email:** `/admin/test-email`
  - Test your email configuration
  - Verify emails are working

- **Logout:** `/admin/logout`
  - Logout from admin session

### 4. Environment Variables Setup in Vercel

**Before accessing admin, make sure these are set in Vercel:**

1. Go to your Vercel project dashboard
2. Navigate to: **Settings → Environment Variables**
3. Add these variables:

```
ADMIN_EMAIL=yuvraj.bhawsar@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

4. **Important:** Set them for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Redeploy** after adding environment variables

### 5. Quick Access Links

Replace `your-domain` with your actual domain:

- **Admin Login:** `https://your-domain.vercel.app/admin/login`
- **Admin Dashboard:** `https://your-domain.vercel.app/admin/registrations`
- **Test Email:** `https://your-domain.vercel.app/admin/test-email`

### 6. Troubleshooting

**Can't login?**
- Check that `ADMIN_EMAIL` is set in Vercel environment variables
- Make sure the email you enter matches exactly (case-insensitive)
- Clear browser cookies and try again

**Redirected to login?**
- Your session might have expired (sessions last 7 days)
- Just login again with your email

**Admin page shows "Unauthorized"?**
- Make sure `ADMIN_EMAIL` environment variable is set in Vercel
- Redeploy your application after setting the variable

### 7. Security Notes

- Admin access is protected by email-based authentication
- Sessions last 7 days
- Only the email in `ADMIN_EMAIL` can access admin pages
- All admin routes require authentication

