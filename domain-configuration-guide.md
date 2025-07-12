# Custom Domain Configuration Guide

## Current Issue
Your custom domain `proofofamiracle.com` is showing authentication errors because it's not pointing to the current Replit deployment.

## Current Replit URL
```
d4920d71-63af-47ca-bf0c-f15fe6bcdd3a-00-266sh0x9nv4h3.janeway.replit.dev
```

## Solution Steps

### 1. Update DNS Records
Update your domain's DNS records to point to the current Replit URL:

**For CNAME Record (Recommended):**
- Type: CNAME
- Name: @ (or www)
- Value: `d4920d71-63af-47ca-bf0c-f15fe6bcdd3a-00-266sh0x9nv4h3.janeway.replit.dev`

### 2. Clear Cache
If using Cloudflare or similar CDN:
1. Go to your Cloudflare dashboard
2. Navigate to Caching > Purge Cache
3. Purge Everything

### 3. Test Authentication
Once DNS propagates (5-30 minutes), test:
- `https://proofofamiracle.com/api/login`
- Should redirect to Replit authentication

### 4. Verify Domain Configuration
The app already includes both domains in REPLIT_DOMAINS:
```
d4920d71-63af-47ca-bf0c-f15fe6bcdd3a-00-266sh0x9nv4h3.janeway.replit.dev,proofofamiracle.com
```

## Troubleshooting
- Check DNS propagation: `nslookup proofofamiracle.com`
- Verify SSL certificate validity
- Ensure no conflicting A records exist

## Notes for Google Play Store
- Once domain is working, the Android app will use `https://proofofamiracle.com`
- This provides a professional branded experience for users
- Authentication will work seamlessly across web and mobile