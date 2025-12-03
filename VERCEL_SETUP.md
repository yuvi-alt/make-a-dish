# Vercel Deployment Setup Guide

## Required Environment Variables

After deploying to Vercel, you need to add the following environment variables in your Vercel project settings:

### 1. Google Places API Key

**Variable Name:** `NEXT_PUBLIC_GOOGLE_PLACES_KEY`

**Value:** Your Google Places API key

**How to get it:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select an existing one
3. Enable the following APIs:
   - Places API
   - Geocoding API
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

### 2. AWS Credentials (if using S3)

**Variable Names:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET`

## Adding Environment Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Key:** `NEXT_PUBLIC_GOOGLE_PLACES_KEY`
   - **Value:** Your API key
   - **Environments:** Select all (Production, Preview, Development)
6. Click **Save**
7. **Important:** Redeploy your application:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**

### Method 2: Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Add environment variable
vercel env add NEXT_PUBLIC_GOOGLE_PLACES_KEY production

# It will prompt you to enter the value
# Repeat for preview and development if needed:
vercel env add NEXT_PUBLIC_GOOGLE_PLACES_KEY preview
vercel env add NEXT_PUBLIC_GOOGLE_PLACES_KEY development

# Pull the latest environment variables
vercel env pull .env.local
```

### Method 3: Using vercel.json (not recommended for secrets)

You can also use a `vercel.json` file, but **do not commit API keys to git**. This method is not secure for secrets.

## Verify Setup

After adding the environment variable and redeploying:

1. Visit your Vercel deployment URL
2. Go to: `https://your-app.vercel.app/api/places/test-page`
3. Check if the API key status shows "✅ Configured"
4. Test with a query like "SW1A 1AA" or "10 Downing Street"

## Troubleshooting

### "API key is not configured" error

- ✅ Check that you added the environment variable in Vercel
- ✅ Make sure you selected all environments (Production, Preview, Development)
- ✅ **Redeploy** your application after adding the variable
- ✅ Check that the variable name is exactly: `NEXT_PUBLIC_GOOGLE_PLACES_KEY`

### API not working after redeploy

- Check Vercel deployment logs for errors
- Verify your Google Cloud API key is valid and has the required APIs enabled
- Test the API directly: `https://your-app.vercel.app/api/places/test?query=SW1A%201AA`

### Environment variable not showing up

- Environment variables are only available after redeployment
- Make sure you're checking the correct environment (production vs preview)
- Try clearing your browser cache

