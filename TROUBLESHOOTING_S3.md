# Troubleshooting S3 Issues

Your environment variables are set, but it's still not working. Let's debug:

## Step 1: Verify You Redeployed

**Important:** After adding environment variables, you MUST redeploy!

1. Go to Vercel Dashboard → Your project
2. Click "Deployments" tab
3. Find the latest deployment
4. Click the three dots (⋯) → "Redeploy"
5. Wait for it to complete

**Did you redeploy after adding the variables?** If not, that's the issue!

---

## Step 2: Check the Exact Error

1. Try to save an address again
2. What error message do you see?
   - Is it about credentials?
   - Is it about bucket not found?
   - Is it about permissions?

---

## Step 3: Verify Your Setup

### Check IAM Policy
1. Go to [IAM Console](https://console.aws.amazon.com/iam)
2. Click on your user (`food-registration-s3-user`)
3. Click "Permissions" tab
4. Click on the policy name
5. **Verify the bucket name in the policy matches exactly:**
   - Should be: `food-registration-2024`
   - Check for typos or extra spaces

### Check Bucket Name
- Your bucket name in Vercel: `food-registration-2024`
- Does it match exactly in AWS S3 Console?
- Is it in region `eu-north-1`?

### Check Access Keys
1. In IAM → Your user → Security credentials
2. Make sure the access key is **Active** (not disabled)
3. If needed, create a new access key and update Vercel

---

## Step 4: Test Credentials

You can test if your credentials work by checking Vercel logs:

1. Go to Vercel Dashboard → Your project
2. Click "Deployments" → Latest deployment
3. Click "View Function Logs"
4. Try saving an address
5. Check the logs for error messages

Look for:
- `CredentialsProviderError` = Wrong credentials
- `NoSuchBucket` = Bucket name wrong or doesn't exist
- `403 Forbidden` = Permission issue
- `InvalidAccessKeyId` = Wrong access key

---

## Step 5: Common Issues

### Issue: "Access denied" or "403 Forbidden"
**Fix:** Your IAM policy might be wrong
1. Check the policy has the correct bucket name
2. Make sure both ARNs are correct:
   - `arn:aws:s3:::food-registration-2024`
   - `arn:aws:s3:::food-registration-2024/*`

### Issue: "Bucket not found" or "NoSuchBucket"
**Fix:** 
1. Check bucket name matches exactly (case-sensitive)
2. Check region matches (`eu-north-1`)
3. Verify bucket exists in AWS Console

### Issue: "Invalid credentials"
**Fix:**
1. Check access keys are correct (no extra spaces)
2. Create new access keys if needed
3. Make sure keys are Active in IAM

### Issue: Still using local storage
**Fix:**
1. Make sure ALL 4 variables are set:
   - ✅ AWS_ACCESS_KEY_ID
   - ✅ AWS_SECRET_ACCESS_KEY
   - ✅ AWS_REGION
   - ✅ AWS_S3_BUCKET
2. Redeploy after adding variables

---

## Quick Fix Checklist

- [ ] All 4 environment variables added to Vercel
- [ ] Variables enabled for Production, Preview, Development
- [ ] Redeployed after adding variables
- [ ] Bucket name matches exactly (case-sensitive)
- [ ] Region matches (`eu-north-1`)
- [ ] IAM policy has correct bucket name
- [ ] Access keys are Active
- [ ] Checked Vercel logs for specific error

---

## Still Not Working?

Share:
1. The exact error message you see
2. What you see in Vercel logs (View Function Logs)
3. Confirmation that you redeployed

This will help identify the exact issue!

