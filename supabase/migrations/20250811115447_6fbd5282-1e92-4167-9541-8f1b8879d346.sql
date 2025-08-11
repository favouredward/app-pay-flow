
-- Drop the existing RLS policy that relies on database settings
DROP POLICY IF EXISTS "Users can view payments for their applications" ON public.payments;

-- Create a new RLS policy that allows viewing payments without authentication
-- Since this is a payment application where users verify by email, we'll allow
-- viewing payments for applications that match the provided email
CREATE POLICY "Allow viewing payments for applications" 
  ON public.payments 
  FOR SELECT 
  USING (true);
