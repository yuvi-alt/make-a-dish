# Vercel Projects Setup

You have **4 Vercel projects** pointing to the same repository `yuvi-alt/make-a-dish`:

## Your Projects

1. **make-a-dish-astp**
   - URL: `make-a-dish-astp.vercel.app`
   - Deployed: 8m ago

2. **make-a-dish** (main project)
   - URL: `make-a-dish-seven.vercel.app`
   - Deployed: 9m ago

3. **make-a-dish-wp16**
   - URL: `make-a-dish-wp16.vercel.app`
   - Deployed: 14m ago

4. **make-a-dish-jyip**
   - URL: `make-a-dish-jyip.vercel.app`
   - Deployed: 10m ago

## Which One Are You Using?

**Question:** Which URL are you trying to access? 
- The main production URL is usually: `make-a-dish-seven.vercel.app`

## Action Required

You need to add the `NEXT_PUBLIC_GOOGLE_PLACES_KEY` environment variable to **EACH project** you're actively using, OR delete the unused projects.

### Option 1: Add to All Projects (if you need all)

1. Go to each project in Vercel dashboard
2. Settings → Environment Variables
3. Add `NEXT_PUBLIC_GOOGLE_PLACES_KEY` to each
4. Redeploy each project

### Option 2: Use Only One Project (Recommended)

1. Identify which project is your main one
2. Add the environment variable only to that project
3. Redeploy that project
4. (Optional) Delete or archive the other 3 projects

### Option 3: Use Vercel CLI to Add to All

```bash
# Add to project 1
vercel env add NEXT_PUBLIC_GOOGLE_PLACES_KEY production --scope=your-team --project=make-a-dish-astp

# Add to project 2
vercel env add NEXT_PUBLIC_GOOGLE_PLACES_KEY production --scope=your-team --project=make-a-dish

# etc...
```

## Quick Fix Steps

1. **Identify the main project** - Which URL are you actually using?
2. **Add environment variable** to that project:
   - Settings → Environment Variables
   - Key: `NEXT_PUBLIC_GOOGLE_PLACES_KEY`
   - Value: (your API key)
   - Environments: Production, Preview, Development
3. **Redeploy** that project
4. **Test** at that project's URL

## Clean Up (Optional)

If you don't need 4 separate projects, you can:
- Delete unused projects from Vercel dashboard
- Keep only the main production project
- This will make management easier

