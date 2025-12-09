# Vercel Environment Variables Setup

You have **4 Vercel projects**. You need to add environment variables to **the project you're actually using**.

## Which Project Are You Using?

Based on your setup, the **main project** is likely:
- **`make-a-dish`** → URL: `make-a-dish-seven.vercel.app`

## Option 1: Add to Main Project Only (Recommended)

If you're only using one project:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **`make-a-dish`** project (the main one)
3. Settings → Environment Variables
4. Add these 4 variables:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` = `eu-north-1`
   - `AWS_S3_BUCKET` = `food-registration-2024`
5. ✅ Enable for Production, Preview, Development
6. **Redeploy this project** (Deployments → Latest → ⋯ → Redeploy)

## Option 2: Add to All Projects (If You Use Multiple)

If you want all 4 projects to work:

1. Repeat the steps above for each project:
   - `make-a-dish` (main)
   - `make-a-dish-astp`
   - `make-a-dish-jyip`
   - `make-a-dish-wp16`

2. Add the same 4 environment variables to each
3. Redeploy each project

## Option 3: Clean Up (Best Practice)

You probably only need **ONE** project. Consider:

1. **Keep:** `make-a-dish` (main project)
2. **Delete the others:**
   - Go to each project → Settings → Delete Project
   - This makes management easier!

## Quick Steps for Main Project

1. **Go to:** https://vercel.com/dashboard
2. **Click:** `make-a-dish` project
3. **Settings** → **Environment Variables**
4. **Add 4 variables** (if not already added)
5. **Redeploy** (Deployments → Latest → ⋯ → Redeploy)
6. **Test:** Visit `https://make-a-dish-seven.vercel.app/register/start`

## Verify It's Working

After redeploying the main project:

1. Visit: `https://make-a-dish-seven.vercel.app/register/start`
2. Fill in the address form
3. Click "Save & Continue"
4. Should work! ✅

## Troubleshooting

### Still not working?

1. **Check which URL you're visiting** - Make sure it matches the project you added variables to
2. **Check you redeployed** - Variables only work after redeploy
3. **Check Vercel logs:**
   - Go to project → Deployments → Latest → View Function Logs
   - Look for S3 errors

### Common Issues

- ❌ Added variables to wrong project
- ❌ Didn't redeploy after adding variables
- ❌ Visiting wrong URL (different project)

---

**Recommendation:** Add variables to the **main project** (`make-a-dish`) and delete the other 3 projects to avoid confusion.

