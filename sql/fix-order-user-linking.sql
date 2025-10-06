-- ============================================================================
-- FIX ORDER USER LINKING
-- ============================================================================

-- Link users to orders (via email)
UPDATE orders o
SET user_id = u.id
FROM auth.users u
WHERE LOWER(o.buyer_email) = LOWER(u.email)
AND o.user_id IS NULL;

-- Zeige Ergebnis
SELECT 
    'Orders User Linking' as step,
    COUNT(*) FILTER (WHERE user_id IS NOT NULL) as linked_to_users,
    COUNT(*) FILTER (WHERE user_id IS NULL) as not_linked_to_users
FROM orders;

-- Zeige deine Orders (⚠️ EMAIL ANPASSEN!)
SELECT 
    ablefy_order_number,
    order_date,
    course_title,
    amount_gross,
    status,
    CASE WHEN user_id IS NOT NULL THEN '✅' ELSE '❌' END as linked
FROM orders
WHERE LOWER(buyer_email) = LOWER('DEINE_EMAIL_HIER')  -- ⚠️ ANPASSEN!
ORDER BY order_date DESC;
