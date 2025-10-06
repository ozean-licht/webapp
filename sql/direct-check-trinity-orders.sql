-- ============================================================================
-- DIRECT CHECK FOR TRINITY STUDIO ORDERS (BYPASSING RLS)
-- ============================================================================
-- Run this AS ADMIN in Supabase SQL Editor
-- ============================================================================

-- Step 1: Disable RLS temporarily to see raw data
SET ROLE postgres;

-- Step 2: Check if orders exist with this email
SELECT 
    '1. Orders by Email (RAW - no RLS)' as check_step,
    COUNT(*) as total_orders
FROM orders
WHERE LOWER(buyer_email) = LOWER('info@trinitystudio.net');

-- Step 3: Show all orders for this email
SELECT 
    '2. Order Details' as check_step,
    id,
    ablefy_order_number,
    buyer_email,
    user_id,
    status,
    course_id,
    course_title,
    order_date,
    CASE 
        WHEN user_id IS NOT NULL THEN '✅ Linked' 
        ELSE '❌ Not Linked' 
    END as link_status
FROM orders
WHERE LOWER(buyer_email) = LOWER('info@trinitystudio.net')
ORDER BY order_date DESC
LIMIT 10;

-- Step 4: Check if user exists
SELECT 
    '3. User Check' as check_step,
    id,
    email,
    created_at
FROM auth.users
WHERE id = '29899081-68f7-4a7c-b838-a3e8654d53aa'
   OR LOWER(email) = LOWER('info@trinitystudio.net');

-- Step 5: Link them if not linked
UPDATE orders
SET user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa'
WHERE LOWER(buyer_email) = LOWER('info@trinitystudio.net')
AND user_id IS NULL;

-- Step 6: Verify linking worked
SELECT 
    '4. After Linking' as check_step,
    COUNT(*) as total_orders,
    COUNT(*) FILTER (WHERE user_id IS NOT NULL) as linked_orders,
    COUNT(*) FILTER (WHERE course_id IS NOT NULL) as orders_with_courses
FROM orders
WHERE LOWER(buyer_email) = LOWER('info@trinitystudio.net');

-- Step 7: Test RLS policy
SET ROLE authenticated;
SET request.jwt.claim.sub = '29899081-68f7-4a7c-b838-a3e8654d53aa';

SELECT 
    '5. With RLS (as user)' as check_step,
    COUNT(*) as orders_visible_to_user
FROM orders
WHERE user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa';

-- Reset role
RESET ROLE;

-- Step 8: Final result
SELECT 
    '6. FINAL RESULT' as check_step,
    user_id,
    buyer_email,
    COUNT(*) as order_count,
    COUNT(*) FILTER (WHERE status IN ('paid', 'Erfolgreich', 'partial')) as paid_orders,
    COUNT(*) FILTER (WHERE course_id IS NOT NULL) as orders_with_courses,
    STRING_AGG(DISTINCT status, ', ') as statuses
FROM orders
WHERE user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa'
GROUP BY user_id, buyer_email;

