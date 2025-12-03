# 🚀 Quick Fix - Add Environment Variable to Vercel

## Step 1: Identify Your Main Project

Which URL are you accessing?
- `make-a-dish-seven.vercel.app` ← **Probably this one (main project)**
- `make-a-dish-astp.vercel.app`
- `make-a-dish-wp16.vercel.app`
- `make-a-dish-jyip.vercel.app`

## Step 2: Add Environment Variable (3 minutes)

### For the MAIN project (`make-a-dish`):

1. **Go to:** https://vercel.com/dashboard
2. **Click on:** `make-a-dish` project (the one with URL `make-a-dish-seven.vercel.app`)
3. **Click:** Settings (left sidebar)
4. **Click:** Environment Variables
5. **Click:** Add New button
6. **Fill in:**
   - **Key:** `NEXT_PUBLIC_GOOGLE_PLACES_KEY`
   - **Value:** (your API key - copy from `.env.local` file)
   - **Environments:** Check all three boxes:
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development
7. **Click:** Save

## Step 3: Redeploy (CRITICAL!)

1. **Go to:** Deployments tab
2. **Find:** Latest deployment
3. **Click:** Three dots (⋯) menu
4. **Click:** Redeploy
5. **Wait:** 1-2 minutes for deployment

## Step 4: Test

Visit: `https://make-a-dish-seven.vercel.app/register/start`

Type a postcode - it should work now! ✅

---

## If You Need It on Other Projects Too

Repeat steps 2-3 for each project you use:
- `make-a-dish-astp`
- `make-a-dish-wp16`
- `make-a-dish-jyip`

## Pro Tip: Clean Up

You probably only need **ONE** project. Consider:
1. Keep: `make-a-dish` (main project)
2. Delete: The other 3 projects from Vercel dashboard
3. This makes management easier!

---

**Most Important:** Remember to **REDEPLOY** after adding the environment variable! 🎯

