# ✅ Fix Vercel Deployment - Quick Checklist

## Step-by-Step Fix for Google Places API

### 1. Get Your API Key
- ✅ Your API key should be in your `.env.local` file
- If you don't have it, get it from Google Cloud Console

### 2. Add to Vercel Dashboard

**Go to Vercel:**
1. Visit: https://vercel.com/dashboard
2. Click on your project: **make-a-dish**
3. Go to: **Settings** → **Environment Variables** (left sidebar)
4. Click: **Add New** button

**Add the variable:**
- **Key:** `NEXT_PUBLIC_GOOGLE_PLACES_KEY`
- **Value:** (paste your API key from `.env.local`)
- **Environments:** 
  - ✅ Production
  - ✅ Preview  
  - ✅ Development
- Click: **Save**

### 3. Redeploy (IMPORTANT!)

**You MUST redeploy after adding environment variables:**

**Option A: Redeploy from Dashboard**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **three dots (⋯)** menu
4. Click **Redeploy**
5. Select **Use existing Build Cache** (optional)
6. Click **Redeploy**

**Option B: Trigger new deployment**
- Push any commit to your repository (even a small change)
- Vercel will auto-deploy with the new environment variable

### 4. Verify It's Working

After redeploying, test:

1. **Test API directly:**
   ```
   https://your-app.vercel.app/api/places/test-page
   ```
   - Should show: "✅ Configured" for API key status

2. **Test the form:**
   ```
   https://your-app.vercel.app/register/start
   ```
   - Type a postcode like "SW1A 1AA"
   - Should see suggestions dropdown

### 5. Troubleshooting

**Still showing "API key is not configured"?**

1. ✅ Double-check variable name: `NEXT_PUBLIC_GOOGLE_PLACES_KEY` (exact spelling)
2. ✅ Make sure you selected ALL environments (Production, Preview, Development)
3. ✅ **Did you redeploy?** Environment variables only work after redeployment!
4. ✅ Check Vercel build logs for any errors
5. ✅ Verify your API key is correct (copy from `.env.local`)

**Check Vercel Logs:**
1. Go to **Deployments** tab
2. Click on latest deployment
3. Check **Build Logs** and **Runtime Logs** for errors

### Quick Command (if using Vercel CLI)

```bash
# Add environment variable via CLI
vercel env add NEXT_PUBLIC_GOOGLE_PLACES_KEY production

# Then redeploy
vercel --prod
```

---

## Most Common Issue

**90% of the time, the problem is:** Not redeploying after adding the environment variable!

Environment variables are injected at **build time** and **runtime**, but only if you redeploy after adding them.

