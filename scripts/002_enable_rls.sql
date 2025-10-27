-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutoring_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Educational content policies
CREATE POLICY "Anyone can view educational content" ON educational_content
  FOR SELECT USING (true);

CREATE POLICY "Tutors can create content" ON educational_content
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tutor'
    )
  );

CREATE POLICY "Tutors can update own content" ON educational_content
  FOR UPDATE USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tutor'
    )
  );

-- Evaluations policies
CREATE POLICY "Anyone can view evaluations" ON evaluations
  FOR SELECT USING (true);

CREATE POLICY "Tutors can create evaluations" ON evaluations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tutor'
    )
  );

-- Evaluation results policies
CREATE POLICY "Students can view own results" ON evaluation_results
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can insert own results" ON evaluation_results
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Tutors can view all results" ON evaluation_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tutor'
    )
  );

-- Tutoring requests policies
CREATE POLICY "Students can view own requests" ON tutoring_requests
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Tutors can view all requests" ON tutoring_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tutor'
    )
  );

CREATE POLICY "Students can create requests" ON tutoring_requests
  FOR INSERT WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'student'
    )
  );

CREATE POLICY "Students can update own requests" ON tutoring_requests
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "Tutors can update requests" ON tutoring_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tutor'
    )
  );

-- Forum posts policies
CREATE POLICY "Anyone can view forum posts" ON forum_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON forum_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON forum_posts
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Users can delete own posts" ON forum_posts
  FOR DELETE USING (author_id = auth.uid());

-- Forum comments policies
CREATE POLICY "Anyone can view comments" ON forum_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON forum_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON forum_comments
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Users can delete own comments" ON forum_comments
  FOR DELETE USING (author_id = auth.uid());
