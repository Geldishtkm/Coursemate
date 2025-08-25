# Email Verification System Setup

This document explains how to set up and use the email verification system in CampusMate.

## 🚀 Quick Setup

### 1. Database Setup
Run the SQL script in your PostgreSQL database:

```sql
-- Connect to your CampusMate database and run:
\i email_verification_setup.sql
```

Or manually execute the commands from the script.

### 2. Environment Variables
Add these to your `.env` file or environment:

```bash
# Gmail SMTP Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587

# Frontend URL (optional, defaults to http://localhost:3000)
FRONTEND_URL=http://localhost:3000
```

### 3. Gmail App Password Setup
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password for "Mail"
4. Use this password in `MAIL_PASSWORD`

## 🔧 How It Works

### Registration Flow
1. User registers → Account created with `is_verified = false`
2. Verification token generated and saved to database
3. Verification email sent with link: `/auth/verify?token=abc123`
4. User clicks link → Account activated (`is_verified = true`)

### Login Flow
1. User attempts login
2. System checks `is_verified` status
3. If not verified → Login denied with message
4. If verified → Login proceeds normally

## 📧 API Endpoints

### Verify Email
```
GET /auth/verify?token={token}
```
- Verifies email token
- Activates user account
- Returns success/error message

### Resend Verification
```
POST /auth/resend-verification?email={email}
```
- Resends verification email
- Useful if original email expired

## 🗄️ Database Schema

### Users Table
- Added `is_verified BOOLEAN NOT NULL DEFAULT FALSE`

### Email Verification Tokens Table
```sql
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    expiry TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT FALSE
);
```

## 🔒 Security Features

- Tokens expire after 24 hours
- Tokens can only be used once
- Automatic cleanup of expired tokens
- Users cannot login without verification
- Existing users automatically marked as verified

## 🧹 Maintenance

The system automatically:
- Cleans up expired tokens every hour
- Logs all verification attempts
- Handles email sending failures gracefully

## 🐛 Troubleshooting

### Email Not Sending
1. Check Gmail credentials
2. Verify app password is correct
3. Check firewall/network settings
4. Review application logs

### Verification Failing
1. Check token expiry (24 hours)
2. Verify token hasn't been used
3. Check database connectivity
4. Review application logs

### Login Still Blocked
1. Verify `is_verified` column exists
2. Check if user was properly verified
3. Restart application after database changes

## 📝 Testing

### Test Registration
1. Register new user
2. Check email inbox for verification link
3. Click verification link
4. Verify user can now login

### Test Unverified Login
1. Register user but don't verify
2. Attempt login
3. Should receive "Please verify your email" message

### Test Token Expiry
1. Wait 24+ hours after registration
2. Try to verify with expired token
3. Should receive "Invalid or expired token" message
