-- Fix course_materials table schema to support binary file storage
-- Run this script in your PostgreSQL database

-- Add file_data column for storing binary file content
ALTER TABLE course_materials ADD COLUMN IF NOT EXISTS file_data BYTEA;

-- Make file_url nullable since we now have file_data for binary files
ALTER TABLE course_materials ALTER COLUMN file_url DROP NOT NULL;

-- Update the type constraint to include the new material types
ALTER TABLE course_materials DROP CONSTRAINT IF EXISTS course_materials_type_check;
ALTER TABLE course_materials ADD CONSTRAINT course_materials_type_check 
    CHECK (type IN ('LECTURE', 'ASSIGNMENT', 'READING', 'VIDEO', 'QUIZ', 'DOCUMENT', 'CODE', 'OTHER'));

-- Add index on file_data for better performance
CREATE INDEX IF NOT EXISTS idx_course_materials_file_data ON course_materials(file_data) WHERE file_data IS NOT NULL;

-- Verify the changes
\d course_materials
