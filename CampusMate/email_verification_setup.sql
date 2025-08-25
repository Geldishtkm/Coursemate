-- Email Verification Setup Script
-- Run this in your PostgreSQL database to set up email verification

-- 1. Add is_verified column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Create email_verification_tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL,
    expiry TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_verification_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_verification_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_user ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_expiry ON email_verification_tokens(expiry);

-- 4. Update existing users to be verified (for backward compatibility)
UPDATE users SET is_verified = TRUE WHERE is_verified IS NULL OR is_verified = FALSE;

-- 5. Verify the setup
SELECT 'Users table updated' as status, COUNT(*) as total_users FROM users;
SELECT 'Verification tokens table created' as status, COUNT(*) as total_tokens FROM email_verification_tokens;
