-- ============================================================================
-- LINK IMPORTED DATA - PostgreSQL Magic 🪄
-- ============================================================================
-- Führe dies im Supabase SQL Editor aus nach dem Import
-- ============================================================================

-- Step 1: Link transactions to orders (via order_number)
-- ============================================================================
UPDATE transactions t
SET order_id = o.id
FROM orders o
WHERE t.order_number = o.ablefy_order_number
AND t.order_id IS NULL
AND o.ablefy_order_number IS NOT NULL;

-- Zeige Ergebnis
SELECT 
    COUNT(*) FILTER (WHERE order_id IS NOT NULL) as linked_transactions,
    COUNT(*) FILTER (WHERE order_id IS NULL AND order_number IS NOT NULL) as unlinked_transactions
FROM transactions;

-- Step 2: Map course_id to transactions (via product_id)
-- ============================================================================
UPDATE transactions t
SET course_id = cm.course_id
FROM course_mapping cm
WHERE t.product_id = cm.ablefy_product_id
AND t.course_id IS NULL
AND cm.is_active = TRUE;

-- Zeige Ergebnis
SELECT 
    COUNT(*) FILTER (WHERE course_id IS NOT NULL) as mapped_transactions,
    COUNT(*) FILTER (WHERE course_id IS NULL AND product_id IS NOT NULL) as unmapped_transactions
FROM transactions;

-- Step 3: Map course_id to orders (via ablefy_product_id)
-- ============================================================================
UPDATE orders o
SET course_id = cm.course_id
FROM course_mapping cm
WHERE o.ablefy_product_id::INTEGER = cm.ablefy_product_id
AND o.course_id IS NULL
AND cm.is_active = TRUE;

-- Zeige Ergebnis
SELECT 
    COUNT(*) FILTER (WHERE course_id IS NOT NULL) as mapped_orders,
    COUNT(*) FILTER (WHERE course_id IS NULL AND ablefy_product_id IS NOT NULL) as unmapped_orders
FROM orders;

-- Step 4: Update course_title in orders
-- ============================================================================
UPDATE orders o
SET course_title = c.title
FROM courses c
WHERE o.course_id = c.id
AND o.course_title IS NULL;

-- Step 5: Link users to transactions (via email)
-- ============================================================================
UPDATE transactions t
SET user_id = u.id
FROM auth.users u
WHERE LOWER(t.buyer_email) = LOWER(u.email)
AND t.user_id IS NULL;

-- Zeige Ergebnis
SELECT 
    COUNT(*) FILTER (WHERE user_id IS NOT NULL) as linked_to_users,
    COUNT(*) FILTER (WHERE user_id IS NULL) as not_linked_to_users,
    COUNT(DISTINCT buyer_email) as unique_buyer_emails
FROM transactions;

-- Step 6: Link users to orders (via email)
-- ============================================================================
UPDATE orders o
SET user_id = u.id
FROM auth.users u
WHERE LOWER(o.buyer_email) = LOWER(u.email)
AND o.user_id IS NULL;

-- Zeige Ergebnis
SELECT 
    COUNT(*) FILTER (WHERE user_id IS NOT NULL) as linked_to_users,
    COUNT(*) FILTER (WHERE user_id IS NULL) as not_linked_to_users,
    COUNT(DISTINCT buyer_email) as unique_buyer_emails
FROM orders;

-- Step 7: Update order financial totals from transactions
-- ============================================================================
UPDATE orders o
SET 
    amount_gross = COALESCE(t.total_amount, 0),
    amount_minus_fees = COALESCE(t.total_minus_fees, 0),
    fees_total = COALESCE(t.total_fees, 0),
    transactions_count = COALESCE(t.count, 0)
FROM (
    SELECT 
        order_id,
        SUM(bezahlt) as total_amount,
        SUM(bezahlt_minus_fee) as total_minus_fees,
        SUM(fees_total) as total_fees,
        COUNT(*) as count
    FROM transactions
    WHERE status = 'Erfolgreich'
    AND order_id IS NOT NULL
    GROUP BY order_id
) t
WHERE o.id = t.order_id;

-- Zeige Ergebnis
SELECT 
    COUNT(*) FILTER (WHERE amount_gross > 0) as orders_with_amounts,
    SUM(amount_gross) as total_revenue,
    AVG(transactions_count) as avg_transactions_per_order
FROM orders;

-- Step 8: Update order status based on successful payments
-- ============================================================================
UPDATE orders o
SET status = 'paid'
WHERE EXISTS (
    SELECT 1 FROM transactions t
    WHERE t.order_id = o.id
    AND t.status = 'Erfolgreich'
)
AND o.status = 'pending';

-- Zeige Ergebnis
SELECT 
    status,
    COUNT(*) as count
FROM orders
GROUP BY status;

-- ============================================================================
-- FINAL STATISTICS
-- ============================================================================
SELECT '✅ LINKING COMPLETE!' as status;

SELECT 
    'Transactions' as entity,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE order_id IS NOT NULL) as linked_to_order,
    COUNT(*) FILTER (WHERE course_id IS NOT NULL) as has_course,
    COUNT(*) FILTER (WHERE user_id IS NOT NULL) as has_user,
    ROUND(AVG(bezahlt)::numeric, 2) as avg_amount
FROM transactions

UNION ALL

SELECT 
    'Orders' as entity,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE transactions_count > 0) as has_transactions,
    COUNT(*) FILTER (WHERE course_id IS NOT NULL) as has_course,
    COUNT(*) FILTER (WHERE user_id IS NOT NULL) as has_user,
    ROUND(AVG(amount_gross)::numeric, 2) as avg_amount
FROM orders;

-- Check dein Account (ersetze mit deiner Email)
SELECT 
    u.email,
    COUNT(o.id) as order_count,
    COUNT(t.id) as transaction_count,
    STRING_AGG(DISTINCT c.title, ', ') as courses
FROM auth.users u
LEFT JOIN orders o ON o.user_id = u.id
LEFT JOIN transactions t ON t.user_id = u.id
LEFT JOIN courses c ON o.course_id = c.id
WHERE u.email = 'DEINE_EMAIL_HIER'  -- ⚠️ ANPASSEN!
GROUP BY u.id, u.email;
