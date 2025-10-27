-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('student', 'tutor');

-- Create enum for education levels
CREATE TYPE education_level AS ENUM ('primaria', 'basicos', 'diversificado');

-- Create enum for subjects
CREATE TYPE subject_type AS ENUM ('matematicas', 'lenguaje', 'ciencias', 'sociales', 'ingles');

-- Create enum for tutoring status
CREATE TYPE tutoring_status AS ENUM ('pending', 'accepted', 'completed', 'cancelled');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER,
  role user_role NOT NULL,
  education_level education_level,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Educational content table
CREATE TABLE educational_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject subject_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  education_level education_level NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluations table
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject subject_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  education_level education_level NOT NULL,
  questions JSONB NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student evaluation results
CREATE TABLE evaluation_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutoring requests
CREATE TABLE tutoring_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tutor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  subject subject_type NOT NULL,
  description TEXT NOT NULL,
  status tutoring_status DEFAULT 'pending',
  scheduled_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum posts
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject subject_type,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum comments
CREATE TABLE forum_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_educational_content_subject ON educational_content(subject);
CREATE INDEX idx_educational_content_level ON educational_content(education_level);
CREATE INDEX idx_evaluations_subject ON evaluations(subject);
CREATE INDEX idx_tutoring_requests_student ON tutoring_requests(student_id);
CREATE INDEX idx_tutoring_requests_tutor ON tutoring_requests(tutor_id);
CREATE INDEX idx_tutoring_requests_status ON tutoring_requests(status);
CREATE INDEX idx_forum_posts_subject ON forum_posts(subject);
CREATE INDEX idx_forum_comments_post ON forum_comments(post_id);
