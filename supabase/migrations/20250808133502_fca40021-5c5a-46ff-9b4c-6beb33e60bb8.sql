
-- Update the payment plans to use 100 naira per month instead of 10,000
UPDATE public.payment_plans 
SET monthly_amount = 100 
WHERE monthly_amount = 10000;

-- Update any existing payment records that might reference the old amounts
-- This ensures consistency in the system
UPDATE public.payments 
SET amount_paid = CASE 
    WHEN months_paid_for = 1 THEN 100
    WHEN months_paid_for = 2 THEN 200  
    WHEN months_paid_for = 4 THEN 400
    ELSE amount_paid
END
WHERE amount_paid IN (10000, 20000, 40000);

-- Update applications table to reflect the new total amounts
UPDATE public.applications 
SET total_amount_paid = CASE 
    WHEN months_paid = 1 THEN 100
    WHEN months_paid = 2 THEN 200
    WHEN months_paid = 3 THEN 300
    WHEN months_paid = 4 THEN 400
    ELSE total_amount_paid
END
WHERE total_amount_paid > 0;
