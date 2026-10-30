-- Database Schema for Wiki CUSAT Project

-- 1. Users Table (Core Authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'alumnus', 'outsider')),
    linkedin_url TEXT,
    github_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Student & Alumni Profiles
CREATE TABLE student_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) UNIQUE,
    department VARCHAR(100),
    branch VARCHAR(100),
    current_semester INTEGER,
    graduation_year INTEGER, -- For Alumni
    clubs TEXT[], -- Array of club names
    indexed_knowledge_points INTEGER DEFAULT 0
);

-- 3. Teacher Profiles
CREATE TABLE teacher_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE,
    department VARCHAR(100),
    specialization TEXT,
    qualification TEXT,
    research_papers TEXT -- Can store titles or links
);

-- 4. Dynamic Data Chunks (Reference to Indexed Data)
-- This links our RAG database chunks to specific users
CREATE TABLE user_knowledge_contributions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    source_type VARCHAR(50), -- 'github', 'linkedin', 'manual'
    chunk_id TEXT, -- ID of the chunk in ChromaDB
    content_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_student_dept ON student_profiles(department);
CREATE INDEX idx_teacher_dept ON teacher_profiles(department);
