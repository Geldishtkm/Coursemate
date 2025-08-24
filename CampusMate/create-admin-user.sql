-- Create Admin User Script
-- Run this in your PostgreSQL database to create the admin user

-- First, check if admin user already exists
SELECT * FROM users WHERE email = 'orazovgeldymurad@gmail.com';

-- If no admin user exists, create one
-- Note: The password hash below is for 'newpassword2005cs' encoded with BCrypt
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
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
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
    is_active,
    student_id,
    department
FROM users 
WHERE email = 'orazovgeldymurad@gmail.com';

-- Alternative: If you want to use a different password, you can update it
-- UPDATE users 
-- SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa'
-- WHERE email = 'orazovgeldymurad@gmail.com';
