-- Create essential tables for questions and answers
-- Drop tables if they exist
DROP TABLE IF EXISTS query_tags CASCADE;
DROP TABLE IF EXISTS responses CASCADE;
DROP TABLE IF EXISTS queries CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL CHECK (role IN ('STUDENT', 'TUTOR', 'ADMIN')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create queries table (questions)
CREATE TABLE queries (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    author_id VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ANSWERED', 'CLOSED')),
    upvotes INTEGER NOT NULL DEFAULT 0,
    downvotes INTEGER NOT NULL DEFAULT 0,
    response_count INTEGER NOT NULL DEFAULT 0,
    is_solved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
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

-- Create indexes for better performance
CREATE INDEX idx_query_author ON queries(author_id);
CREATE INDEX idx_query_status ON queries(status);
CREATE INDEX idx_query_created ON queries(created_at);
CREATE INDEX idx_response_query ON responses(query_id);
CREATE INDEX idx_response_author ON responses(author_id);

-- Insert a test user
INSERT INTO users (id, first_name, last_name, email, password, role, is_active) 
VALUES ('test-user-1', 'John', 'Doe', 'john.doe@example.com', 'password123', 'STUDENT', true);

-- Insert a test query
INSERT INTO queries (id, title, content, category, author_id, status) 
VALUES ('test-query-1', 'How to implement binary search tree deletion?', 'I''m struggling with implementing the delete operation for a binary search tree. Can someone explain the different cases?', 'computer-science', 'test-user-1', 'OPEN');

-- Insert test tags
INSERT INTO query_tags (query_id, tag) VALUES ('test-query-1', 'BST');
INSERT INTO query_tags (query_id, tag) VALUES ('test-query-1', 'Algorithms');
INSERT INTO query_tags (query_id, tag) VALUES ('test-query-1', 'CS301');

-- Insert a test response
INSERT INTO responses (id, content, author_id, query_id) 
VALUES ('test-response-1', 'Here''s how to implement BST deletion with the three cases...', 'test-user-1', 'test-query-1');

-- Update query response count
UPDATE queries SET response_count = 1 WHERE id = 'test-query-1';
