-- ============================================================================
-- SIMPLE CHECK FOR TRINITY ORDERS (NO RLS ISSUES)
-- ============================================================================
-- Einfacher Check ohne RLS Probleme
-- ============================================================================

-- Check 1: Gibt es Orders mit dieser Email?
SELECT 
    'Check 1: Orders mit Email' as info,
    COUNT(*) as total
FROM orders
WHERE LOWER(buyer_email) = LOWER('info@trinitystudio.net');

-- Check 2: Sind sie linked?
SELECT 
    'Check 2: Link Status' as info,
    ablefy_order_number,
    buyer_email,
    user_id,
    status,
    course_id,
    course_title,
    CASE 
        WHEN user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa' THEN '✅ Correct User'
        WHEN user_id IS NOT NULL THEN '⚠️ Different User'
        ELSE '❌ Not Linked'
    END as link_status
FROM orders
WHERE LOWER(buyer_email) = LOWER('info@trinitystudio.net')
ORDER BY order_date DESC
LIMIT 10;

-- Check 3: Link Orders wenn nötig
DO $$
DECLARE
    rows_updated INTEGER;
BEGIN
    UPDATE orders
    SET user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa'
    WHERE LOWER(buyer_email) = LOWER('info@trinitystudio.net')
    AND (user_id IS NULL OR user_id != '29899081-68f7-4a7c-b838-a3e8654d53aa');
    
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    
    RAISE NOTICE '✅ Updated % orders', rows_updated;
END $$;

-- Check 4: Finale Verifizierung
SELECT 
    'Check 3: Final Result' as info,
    COUNT(*) as total_orders,
    COUNT(*) FILTER (WHERE user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa') as linked_to_user,
    COUNT(*) FILTER (WHERE course_id IS NOT NULL) as with_courses,
    COUNT(*) FILTER (WHERE status IN ('paid', 'Erfolgreich', 'partial')) as paid_status,
    COUNT(*) FILTER (
        WHERE user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa' 
        AND course_id IS NOT NULL 
        AND status IN ('paid', 'Erfolgreich', 'partial')
    ) as should_show_in_bibliothek
FROM orders
WHERE LOWER(buyer_email) = LOWER('info@trinitystudio.net');

-- Check 5: Beispiel Orders
SELECT 
    'Check 4: Sample Orders' as info,
    ablefy_order_number,
    status,
    course_id,
    c.title as course_title,
    c.slug as course_slug
FROM orders o
LEFT JOIN courses c ON o.course_id = c.id
WHERE o.user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa'
ORDER BY o.order_date DESC
LIMIT 5;

-- Check 6: Status Werte
SELECT 
    'Check 5: Status Values' as info,
    status,
    COUNT(*) as count
FROM orders
WHERE user_id = '29899081-68f7-4a7c-b838-a3e8654d53aa'
GROUP BY status;

