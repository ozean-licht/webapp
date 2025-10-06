-- ============================================================================
-- DEBUG BIBLIOTHEK QUERY
-- ============================================================================
-- Für User: info@trinitystudio.net
-- User ID: 29899081-68f7-4a7c-b838-a3e8654d53aa

-- Step 1: Check if user exists
SELECT 
    'User Check' as step,
    id,
    email,
    created_at
FROM auth.users
WHERE id = '29899081-68f7-4a7c-b838-a3e8654d53aa';

-- Step 2: Check orders for this user
SELECT 
    'Orders for User' as step,
    id,
    ablefy_order_number,
    buyer_email,
    user_id,
    status,
    course_id,
    course_title,
    order_date
FROM orders
WHERE user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa'
ORDER BY order_date DESC;

-- Step 3: Check orders with 'paid' status
SELECT 
    'Paid Orders' as step,
    COUNT(*) as total_orders,
    COUNT(*) FILTER (WHERE course_id IS NOT NULL) as orders_with_courses,
    COUNT(*) FILTER (WHERE course_id IS NULL) as orders_without_courses
FROM orders
WHERE user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa'
AND status = 'paid';

-- Step 4: The exact query from bibliothek/page.tsx
SELECT 
    'Query from Bibliothek' as step,
    o.id,
    o.course_id,
    o.order_date,
    o.source,
    o.status,
    c.id as course_real_id,
    c.title,
    c.subtitle,
    c.description,
    c.slug,
    c.thumbnail_url_desktop,
    c.thumbnail_url_mobile,
    c.tags,
    c.price
FROM orders o
LEFT JOIN courses c ON o.course_id = c.id
WHERE o.user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa'
AND o.status = 'paid'
AND o.course_id IS NOT NULL
ORDER BY o.order_date DESC;

-- Step 5: Check what status values exist
SELECT 
    'Order Status Values' as step,
    status,
    COUNT(*) as count
FROM orders
WHERE user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa'
GROUP BY status;

-- Step 6: Check if courses table has data
SELECT 
    'Courses in Database' as step,
    COUNT(*) as total_courses
FROM courses;

-- Step 7: Try without status filter
SELECT 
    'Orders WITHOUT status filter' as step,
    o.id,
    o.ablefy_order_number,
    o.status,
    o.course_id,
    c.title as course_title,
    c.slug as course_slug
FROM orders o
LEFT JOIN courses c ON o.course_id = c.id
WHERE o.user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa'
AND o.course_id IS NOT NULL
ORDER BY o.order_date DESC;

-- Step 8: Check enum values for order_status
SELECT 
    'Valid Order Status Values' as step,
    enumlabel as status_value
FROM pg_enum
WHERE enumtypid = 'order_status'::regtype
ORDER BY enumsortorder;

