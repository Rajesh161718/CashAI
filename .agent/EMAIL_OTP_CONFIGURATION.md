# Email OTP Configuration Guide

## ✅ Good News: Supabase CAN Send OTP Codes (FREE!)

Supabase sends magic links by default, but you can easily configure it to send **6-digit OTP codes** instead - still 100% FREE!

---

## 🔧 Configure Supabase to Send OTP Codes

### Step 1: Access Email Templates

1. Go to https://supabase.com/dashboard
2. Select your project: `irjbjqvleuedffdfibmt`
3. Navigate to **Authentication** → **Email Templates** (left sidebar)

### Step 2: Edit the Magic Link Template

1. Find the **"Magic Link"** template
2. Look for this line in the template:
   ```html
   {{ .ConfirmationURL }}
   ```
3. **Replace it with:**
   ```html
   {{ .Token }}
   ```

### Step 3: Customize the Template (Optional)

Here's a simple OTP email template you can use:

```html
<h2>Your Login Code</h2>
<p>Hi there!</p>
<p>Your verification code is:</p>
<h1 style="font-size: 32px; letter-spacing: 8px; font-family: monospace;">{{ .Token }}</h1>
<p>This code will expire in 60 minutes.</p>
<p>If you didn't request this code, you can safely ignore this email.</p>
```

### Step 4: Save and Test

1. Click **Save** at the bottom
2. Test your app - it should now send OTP codes instead of magic links!

---

## 🎯 How It Works

- `{{ .Token }}` = 6-digit OTP code (e.g., 123456)
- `{{ .ConfirmationURL }}` = Magic link URL

By using `{{ .Token }}` in your email template, Supabase will send the OTP code that your app expects!

---

## 🆓 Free Email OTP Alternatives (If You Want to Switch)

If you prefer to use a different service, here are free alternatives:

### 1. **Brevo (formerly Sendinblue)** ⭐ Recommended
- **Free Tier**: 300 emails/day
- **Setup**: Easy API integration
- **Cost**: FREE forever for basic use
- **Website**: https://www.brevo.com
- **Best For**: Small to medium apps

### 2. **Amazon SES (Simple Email Service)**
- **Free Tier**: 3,000 emails/month for 12 months (new AWS accounts)
- **After Free Tier**: $0.10 per 1,000 emails (very cheap)
- **Setup**: Requires AWS account
- **Website**: https://aws.amazon.com/ses/
- **Best For**: Scalable production apps

### 3. **Resend**
- **Free Tier**: 3,000 emails/month
- **Setup**: Very simple API
- **Cost**: FREE for 3k emails/month
- **Website**: https://resend.com
- **Best For**: Modern developer experience

### 4. **MojoAuth**
- **Free Tier**: Available (check their site)
- **Setup**: Dedicated OTP service
- **Website**: https://mojoauth.com
- **Best For**: Dedicated OTP authentication

### 5. **SendGrid**
- **Free Tier**: 100 emails/day
- **Setup**: Popular and reliable
- **Website**: https://sendgrid.com
- **Best For**: Established service with good docs

---

## 💡 Recommendation

**Stick with Supabase!** Here's why:

✅ **Already integrated** - No extra code needed
✅ **100% FREE** - No limits on free tier
✅ **Just configure the template** - 2-minute fix
✅ **Handles verification** - Built-in security
✅ **No additional dependencies** - Keep it simple

The other services would require:
- Additional API integration
- Managing API keys
- Writing OTP generation logic
- Handling email delivery
- Managing OTP expiration

---

## 🚀 Quick Fix Steps

1. **Go to Supabase Dashboard** → Authentication → Email Templates
2. **Find "Magic Link" template**
3. **Replace `{{ .ConfirmationURL }}` with `{{ .Token }}`**
4. **Save**
5. **Test your app** - OTP codes should now arrive!

---

## 🔍 Troubleshooting

### Still receiving magic links?
- Make sure you saved the email template
- Clear your browser cache
- Wait a few minutes for changes to propagate

### OTP not in email?
- Check spam folder
- Verify you replaced the correct variable
- Make sure the template includes `{{ .Token }}`

### Want to customize the email design?
- You can add HTML, CSS, and styling
- Use variables like `{{ .SiteURL }}`, `{{ .Token }}`, etc.
- Preview the email before saving

---

## 📊 Comparison: Supabase vs Alternatives

| Feature | Supabase | Brevo | Amazon SES | Resend |
|---------|----------|-------|------------|--------|
| **Free Tier** | Unlimited | 300/day | 3k/month | 3k/month |
| **Setup Time** | 2 minutes | 30 min | 1 hour | 30 min |
| **Integration** | Built-in ✅ | Custom API | Custom API | Custom API |
| **Verification** | Automatic ✅ | Manual | Manual | Manual |
| **Cost** | FREE ✅ | FREE | Paid after 12mo | FREE |

---

## ✨ Bottom Line

**Just configure the Supabase email template!** It's the easiest and fastest solution. No need to integrate another service. 🎉
