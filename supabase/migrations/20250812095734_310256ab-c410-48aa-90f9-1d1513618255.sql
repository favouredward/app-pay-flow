
-- Fix the RLS policy to allow public read access for email verification
DROP POLICY IF EXISTS "No public access to view applications" ON applications;

-- Create a new policy that allows public read access for email verification
CREATE POLICY "Allow public read for email verification" 
  ON applications 
  FOR SELECT 
  USING (true);
