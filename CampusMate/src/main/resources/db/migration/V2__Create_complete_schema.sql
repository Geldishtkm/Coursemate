-- Complete CampusMate Database Schema
-- This migration creates all necessary tables with proper structure

-- Drop existing tables if they exist (for clean start)
DROP TABLE IF EXISTS course_materials CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS queries CASCADE;
DROP TABLE IF EXISTS responses CASCADE;
DROP TABLE IF EXISTS query_tags CASCADE;
DROP TABLE IF EXISTS votes CASCADE;

-- Create users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL CHECK (role IN ('STUDENT', 'TUTOR', 'ADMIN')),
    student_id VARCHAR(50),
    department VARCHAR(100),
    avatar_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create subjects table
CREATE TABLE subjects (
    id VARCHAR(255) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    department VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    prerequisites TEXT[],
    topics TEXT[],
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE courses (
    id VARCHAR(255) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    subject_id VARCHAR(255) NOT NULL,
    professor_id VARCHAR(255) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    year VARCHAR(4) NOT NULL,
    credits INTEGER NOT NULL,
    max_students INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (professor_id) REFERENCES users(id)
);

-- Create course_materials table with ALL required fields
CREATE TABLE course_materials (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('LECTURE', 'ASSIGNMENT', 'READING', 'VIDEO', 'QUIZ')),
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Create enrollments table with ALL required fields
CREATE TABLE enrollments (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT true,
    grade VARCHAR(5),
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(user_id, course_id)
);

-- Create projects table
CREATE TABLE projects (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    leader_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'PLANNING' CHECK (status IN ('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD')),
    max_members INTEGER NOT NULL DEFAULT 1,
    current_members INTEGER NOT NULL DEFAULT 1,
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    deadline TIMESTAMP NOT NULL,
    skills_required TEXT[],
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Create project_members table
CREATE TABLE project_members (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('LEADER', 'MEMBER', 'MENTOR')),
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(project_id, user_id)
);

-- Create queries table (questions)
CREATE TABLE queries (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    author_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ANSWERED', 'CLOSED')),
    upvotes INTEGER NOT NULL DEFAULT 0,
    downvotes INTEGER NOT NULL DEFAULT 0,
    response_count INTEGER NOT NULL DEFAULT 0,
    is_solved BOOLEAN NOT NULL DEFAULT false,
    solved_at TIMESTAMP,
    solved_by_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (solved_by_id) REFERENCES users(id)
);

-- Create responses table (answers)
CREATE TABLE responses (
    id VARCHAR(255) PRIMARY KEY,
    content TEXT NOT NULL,
    author_id VARCHAR(255) NOT NULL,
    query_id VARCHAR(255) NOT NULL,
    is_accepted BOOLEAN NOT NULL DEFAULT false,
    upvotes INTEGER NOT NULL DEFAULT 0,
    downvotes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (query_id) REFERENCES queries(id)
);

-- Create query_tags table
CREATE TABLE query_tags (
    query_id VARCHAR(255) NOT NULL,
    tag VARCHAR(255) NOT NULL,
    FOREIGN KEY (query_id) REFERENCES queries(id),
    PRIMARY KEY (query_id, tag)
);

-- Create votes table
CREATE TABLE votes (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('QUERY', 'RESPONSE')),
    target_id VARCHAR(255) NOT NULL,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('UPVOTE', 'DOWNVOTE')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, target_type, target_id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_course_subject ON courses(subject_id);
CREATE INDEX idx_course_professor ON courses(professor_id);
CREATE INDEX idx_enrollment_user ON enrollments(user_id);
CREATE INDEX idx_enrollment_course ON enrollments(course_id);
CREATE INDEX idx_project_leader ON projects(leader_id);
CREATE INDEX idx_project_course ON projects(course_id);
CREATE INDEX idx_query_author ON queries(author_id);
CREATE INDEX idx_query_status ON queries(status);
CREATE INDEX idx_query_category ON queries(category);
CREATE INDEX idx_response_query ON responses(query_id);
CREATE INDEX idx_response_author ON responses(author_id);
CREATE INDEX idx_material_course ON course_materials(course_id);
CREATE INDEX idx_material_type ON course_materials(type);
CREATE INDEX idx_material_uploaded_by ON course_materials(uploaded_by);
CREATE INDEX idx_material_public ON course_materials(is_public);

-- Insert sample data
INSERT INTO users (id, first_name, last_name, email, password, role, is_active) VALUES
('user-1', 'John', 'Doe', 'john.doe@university.edu', 'password123', 'STUDENT', true),
('user-2', 'Jane', 'Smith', 'jane.smith@university.edu', 'password123', 'TUTOR', true),
('user-3', 'Dr. Michael', 'Johnson', 'michael.johnson@university.edu', 'password123', 'ADMIN', true);

INSERT INTO subjects (id, code, name, description, department, credits, difficulty) VALUES
('subject-1', 'CS101', 'Introduction to Computer Science', 'Basic programming concepts', 'Computer Science', 3, 'BEGINNER'),
('subject-2', 'CS201', 'Data Structures', 'Advanced programming and algorithms', 'Computer Science', 4, 'INTERMEDIATE');

INSERT INTO courses (id, code, title, description, subject_id, professor_id, semester, year, credits, max_students) VALUES
('course-1', 'CS101-01', 'Programming Fundamentals', 'Learn basic programming', 'subject-1', 'user-2', 'Fall', '2024', 3, 30),
('course-2', 'CS201-01', 'Advanced Programming', 'Data structures and algorithms', 'subject-2', 'user-2', 'Fall', '2024', 4, 25);

INSERT INTO queries (id, title, content, category, author_id, status) VALUES
('query-1', 'How to implement binary search tree deletion?', 'I''m struggling with implementing the delete operation for a binary search tree. Can someone explain the different cases?', 'computer-science', 'user-1', 'OPEN'),
('query-2', 'Database normalization question', 'What''s the difference between 2NF and 3NF? I have a table that I think needs normalization but I''m not sure which form to apply.', 'computer-science', 'user-1', 'OPEN');

INSERT INTO query_tags (query_id, tag) VALUES
('query-1', 'BST'),
('query-1', 'Algorithms'),
('query-1', 'CS301'),
('query-2', 'SQL'),
('query-2', 'Normalization'),
('query-2', 'CS302');

-- Update query response counts
UPDATE queries SET response_count = 0 WHERE id IN ('query-1', 'query-2');
