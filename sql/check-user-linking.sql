-- ============================================================================
-- CHECK USER LINKING
-- ============================================================================

-- 1. Wie viele Users gibt es in auth.users?
SELECT 
    'Total Users in auth.users' as info,
    COUNT(*) as count
FROM auth.users;

-- 2. Zeige alle auth.users mit ihren Emails
SELECT 
    id,
    email,
    created_at
FROM auth.users
ORDER BY created_at DESC;

-- 3. Für jeden User: Orders und Transactions
SELECT 
    u.email as user_email,
    COUNT(DISTINCT o.id) as orders_count,
    COUNT(DISTINCT t.id) as transactions_count,
    STRING_AGG(DISTINCT o.ablefy_order_number::TEXT, ', ') as order_numbers
FROM auth.users u
LEFT JOIN orders o ON LOWER(o.buyer_email) = LOWER(u.email)
LEFT JOIN transactions t ON LOWER(t.buyer_email) = LOWER(u.email)
GROUP BY u.id, u.email
ORDER BY orders_count DESC;

-- 4. Deine spezifischen Orders (alle mit deiner Email)
-- ⚠️ ERSETZE 'DEINE_EMAIL' mit deiner echten Email!
SELECT 
    o.ablefy_order_number,
    o.buyer_email,
    o.order_date,
    o.course_title,
    o.amount_gross,
    o.status,
    o.user_id,
    CASE 
        WHEN o.user_id IS NOT NULL THEN '✅ Linked'
        ELSE '❌ Not Linked'
    END as link_status
FROM orders o
WHERE LOWER(o.buyer_email) = LOWER('DEINE_EMAIL')  -- ⚠️ ANPASSEN!
ORDER BY o.order_date DESC;

-- 5. Check Email-Varianten (spaces, case, etc.)
SELECT 
    DISTINCT 
    buyer_email,
    COUNT(*) as order_count
FROM orders
WHERE buyer_email ILIKE '%DEIN_NAME%'  -- ⚠️ ANPASSEN (z.B. '%sergej%' oder '%lohmann%')
GROUP BY buyer_email
ORDER BY order_count DESC;
