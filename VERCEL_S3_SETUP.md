# ⚠️ S3 Setup Required for Vercel

Your app is deployed on Vercel, which requires AWS S3 for data storage (the filesystem is read-only).

## Quick Setup (15 minutes)

### Step 1: Create S3 Bucket
1. Go to [AWS S3 Console](https://console.aws.amazon.com/s3)
2. Click "Create bucket"
3. Name: `food-registration-2024` (or your choice)
4. Region: `us-east-1` (or closest to you)
5. Enable encryption
6. Block all public access ✅
7. Create bucket

### Step 2: Create IAM User
1. Go to [IAM Console](https://console.aws.amazon.com/iam)
2. Users → Create user → Name: `food-registration-s3-user`
3. Create policy (JSON):
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
    "Resource": [
      "arn:aws:s3:::YOUR_BUCKET_NAME",
      "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    ]
  }]
}
```
4. Replace `YOUR_BUCKET_NAME` with your actual bucket name
5. Attach policy to user
6. Create access key → Save both keys!

### Step 3: Add to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Your project → Settings → Environment Variables
3. Add these 4 variables:
   - `AWS_ACCESS_KEY_ID` = (your access key)
   - `AWS_SECRET_ACCESS_KEY` = (your secret key)
   - `AWS_REGION` = (e.g., `us-east-1`)
   - `AWS_S3_BUCKET` = (your bucket name)
4. ✅ Enable for Production, Preview, Development
5. Redeploy

## That's it! 🎉

After redeploying, your app will work on Vercel.

**Cost:** ~$0.03-0.15/month for small apps (very cheap!)

