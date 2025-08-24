-- Insert default admin user
-- This script should be run manually to create the admin account
-- DO NOT include this in automatic database initialization

INSERT INTO users (
    id,
    first_name,
    last_name,
    email,
    password,
    role,
    student_id,
    department,
    is_active,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Admin',
    'User',
    'orazovgeldymurad@gmail.com',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', -- 'newpassword2005cs' encoded with BCrypt
    'ADMIN',
    'ADMIN001',
    'System Administration',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Verify the admin user was created
SELECT 
    first_name, 
    last_name, 
    email, 
    role, 
    is_active 
FROM users 
WHERE email = 'orazovgeldymurad@gmail.com';
