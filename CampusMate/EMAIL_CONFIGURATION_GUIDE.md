# Email Verification Configuration Guide

## 🚨 **CRITICAL: Email Verification is MANDATORY**

The system requires email verification to be properly configured before users can register. If email configuration is missing, registration will fail.

## 🔧 **Required Environment Variables**

Add these to your environment or create a `.env` file:

```bash
# Gmail SMTP Configuration (REQUIRED)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587

# Frontend URL (optional, defaults to http://localhost:3000)
FRONTEND_URL=http://localhost:3000
```

## 📧 **Gmail App Password Setup**

1. **Enable 2-Factor Authentication** on your Google Account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. **Use the generated password** in `MAIL_PASSWORD`

## ✅ **Verification Steps**

1. **Set environment variables** with your Gmail credentials
2. **Restart the backend** application
3. **Test registration** - should now work with email verification
4. **Check email inbox** for verification link

## 🐛 **Troubleshooting**

### "Registration service temporarily unavailable"
- Email configuration is missing
- Set `MAIL_USERNAME` and `MAIL_PASSWORD`

### "Failed to send verification email"
- Check Gmail credentials
- Verify app password is correct
- Check firewall/network settings

### Transaction rollback errors
- Usually caused by missing email configuration
- Ensure all required environment variables are set

## 🔒 **Security Note**

- Never commit `.env` files to version control
- Use environment variables in production
- App passwords are more secure than regular passwords
