# Fix GoDaddy DNS Conflict - "Record name www conflicts with another record"

You're getting this error because there's already a `www` CNAME record in GoDaddy. You need to **update or delete the old one** first.

## Quick Fix (2 minutes)

### Step 1: Find the Existing www Record

1. In GoDaddy DNS Management, scroll down to the **Records** section
2. Look for an existing record with:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Value:** (probably something like `@` or another domain)

### Step 2: Update or Delete the Old Record

You have two options:

**Option A: Update the Existing Record (Recommended)**
1. Find the existing `www` CNAME record
2. Click **"Edit"** (or the pencil icon ✏️)
3. Change the **Value** to: `ff604acf7db66b07.vercel-dns-017.com.` (the Vercel CNAME)
4. Click **"Save"**

**Option B: Delete the Old Record**
1. Find the existing `www` CNAME record
2. Click **"Delete"** (or the trash icon 🗑️)
3. Confirm deletion
4. Then add the new record with Vercel's value

### Step 3: Add the New Record (if you deleted)

If you deleted the old record:
1. Click **"Add"** button
2. Fill in:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Value:** `ff604acf7db66b07.vercel-dns-017.com.`
   - **TTL:** `1/2 Hour` (or default)
3. Click **"Save"**

---

## Step-by-Step with Screenshots Guide

### What You'll See in GoDaddy

In your Records section, you'll see something like:

```
Type    Name    Value                    TTL
CNAME   www     @                       1/2 Hour  [Edit] [Delete]
```

This is the conflicting record!

### How to Fix It

1. **Click "Edit"** on that existing `www` CNAME record
2. **Change the Value** from `@` (or whatever it is) to: `ff604acf7db66b07.vercel-dns-017.com.`
3. **Click "Save"**

That's it! The conflict will be resolved.

---

## Common Old www Records in GoDaddy

The old record might have one of these values:
- `@` (points to root domain)
- `yourdomain.com` (points to domain)
- Another CNAME value

**Just replace it with:** `ff604acf7db66b07.vercel-dns-017.com.`

---

## After Fixing

1. The error should disappear
2. The record should save successfully
3. Wait 5-60 minutes for DNS propagation
4. Check Vercel dashboard - domain should show "Valid Configuration"

---

## Still Having Issues?

If you can't find the conflicting record:

1. **Check all record types:**
   - Look for CNAME records
   - Look for A records with name `www`
   - Delete any that conflict

2. **Refresh the page:**
   - Sometimes GoDaddy's interface needs a refresh
   - Try refreshing and looking again

3. **Check for multiple www records:**
   - There might be more than one
   - Delete all old `www` records
   - Add the new Vercel one

---

## Quick Checklist

- [ ] Found existing `www` CNAME record
- [ ] Updated it with Vercel's value OR deleted it
- [ ] Saved the changes
- [ ] No more conflict error
- [ ] Waiting for DNS propagation

---

**The fix is simple:** Just update the existing `www` record's value to the Vercel CNAME, or delete it and add a new one!

