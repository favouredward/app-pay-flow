
-- Clear all payment records and reset application payment status
DELETE FROM payments;

-- Reset all applications payment status and amounts back to default
UPDATE applications 
SET 
  payment_status = 'unpaid',
  months_paid = 0,
  total_amount_paid = 0;
