-- ============================================================================
-- FIX ORDERS FOR info@trinitystudio.net
-- ============================================================================
-- User ID: 29899081-68f7-4a7c-b838-a3e8654d53aa
-- Email: info@trinitystudio.net

-- Step 1: Check if orders exist with this email
SELECT 
    'Orders mit dieser E-Mail' as info,
    COUNT(*) as anzahl
FROM orders
WHERE LOWER(buyer_email) = LOWER('info@trinitystudio.net');

-- Step 2: Show all orders for this email
SELECT 
    o.id,
    o.ablefy_order_number,
    o.buyer_email,
    o.order_date,
    o.course_title,
    o.course_id,
    o.amount_gross,
    o.status,
    o.user_id,
    CASE 
        WHEN o.user_id IS NOT NULL THEN '✅ Linked'
        ELSE '❌ Not Linked'
    END as link_status
FROM orders o
WHERE LOWER(o.buyer_email) = LOWER('info@trinitystudio.net')
ORDER BY o.order_date DESC;

-- Step 3: Link orders to user
UPDATE orders o
SET user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa'
WHERE LOWER(o.buyer_email) = LOWER('info@trinitystudio.net')
AND o.user_id IS NULL;

-- Step 4: Verify the linking
SELECT 
    'Nach Update' as info,
    COUNT(*) FILTER (WHERE user_id IS NOT NULL) as linked,
    COUNT(*) FILTER (WHERE user_id IS NULL) as not_linked
FROM orders
WHERE LOWER(buyer_email) = LOWER('info@trinitystudio.net');

-- Step 5: Show final result - Orders with courses
SELECT 
    o.id,
    o.ablefy_order_number,
    o.order_date,
    o.status,
    o.course_id,
    c.title as course_title,
    c.slug as course_slug,
    CASE WHEN o.user_id IS NOT NULL THEN '✅' ELSE '❌' END as linked
FROM orders o
LEFT JOIN courses c ON o.course_id = c.id
WHERE LOWER(o.buyer_email) = LOWER('info@trinitystudio.net')
AND o.status = 'paid'
ORDER BY o.order_date DESC;

-- Step 6: Also link transactions (if any)
UPDATE transactions t
SET user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa'
WHERE LOWER(t.buyer_email) = LOWER('info@trinitystudio.net')
AND t.user_id IS NULL;

-- Step 7: Final verification
SELECT 
    'Final Check' as step,
    (SELECT COUNT(*) FROM orders WHERE user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa') as total_orders,
    (SELECT COUNT(*) FROM orders WHERE user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa' AND status = 'paid') as paid_orders,
    (SELECT COUNT(*) FROM orders WHERE user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa' AND status = 'paid' AND course_id IS NOT NULL) as paid_orders_with_courses;

