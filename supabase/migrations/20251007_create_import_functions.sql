-- ============================================================================
-- HELPER FUNCTIONS FOR ABLEFY IMPORT
-- ============================================================================
-- Purpose: Functions to link imported data after initial import
-- Created: 07. Oktober 2025
-- ============================================================================

-- Function 1: Link transactions to orders based on order_number
CREATE OR REPLACE FUNCTION link_transactions_to_orders()
RETURNS TABLE (
    linked_count INTEGER,
    unlinked_count INTEGER
) AS $$
DECLARE
    v_linked_count INTEGER := 0;
    v_unlinked_count INTEGER := 0;
BEGIN
    -- Update transactions with order_id from orders table
    UPDATE transactions t
    SET order_id = o.id
    FROM orders o
    WHERE t.order_number = o.ablefy_order_number
    AND t.order_id IS NULL
    AND o.ablefy_order_number IS NOT NULL;
    
    GET DIAGNOSTICS v_linked_count = ROW_COUNT;
    
    -- Count unlinked transactions
    SELECT COUNT(*) INTO v_unlinked_count
    FROM transactions
    WHERE order_id IS NULL
    AND order_number IS NOT NULL;
    
    RETURN QUERY SELECT v_linked_count, v_unlinked_count;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Map courses from products using course_mapping table
CREATE OR REPLACE FUNCTION map_courses_from_products()
RETURNS TABLE (
    transactions_mapped INTEGER,
    orders_mapped INTEGER
) AS $$
DECLARE
    v_trans_count INTEGER := 0;
    v_order_count INTEGER := 0;
BEGIN
    -- Update transactions with course_id
    UPDATE transactions t
    SET course_id = cm.course_id
    FROM course_mapping cm
    WHERE t.product_id = cm.ablefy_product_id
    AND t.course_id IS NULL
    AND cm.is_active = TRUE;
    
    GET DIAGNOSTICS v_trans_count = ROW_COUNT;
    
    -- Update orders with course_id
    UPDATE orders o
    SET course_id = cm.course_id
    FROM course_mapping cm
    WHERE o.ablefy_product_id::INTEGER = cm.ablefy_product_id
    AND o.course_id IS NULL
    AND cm.is_active = TRUE;
    
    GET DIAGNOSTICS v_order_count = ROW_COUNT;
    
    RETURN QUERY SELECT v_trans_count, v_order_count;
END;
$$ LANGUAGE plpgsql;

-- Function 3: Create or link users based on email
CREATE OR REPLACE FUNCTION create_users_from_transactions()
RETURNS TABLE (
    users_created INTEGER,
    users_linked INTEGER
) AS $$
DECLARE
    v_created INTEGER := 0;
    v_linked INTEGER := 0;
    v_user_id UUID;
    v_email TEXT;
    v_first_name TEXT;
    v_last_name TEXT;
BEGIN
    -- Link existing users
    UPDATE transactions t
    SET user_id = u.id
    FROM auth.users u
    WHERE LOWER(t.buyer_email) = LOWER(u.email)
    AND t.user_id IS NULL;
    
    GET DIAGNOSTICS v_linked = ROW_COUNT;
    
    -- Also update orders
    UPDATE orders o
    SET user_id = u.id
    FROM auth.users u
    WHERE LOWER(o.buyer_email) = LOWER(u.email)
    AND o.user_id IS NULL;
    
    -- Return counts
    RETURN QUERY SELECT v_created, v_linked;
END;
$$ LANGUAGE plpgsql;

-- Function 4: Update order financial totals from transactions
CREATE OR REPLACE FUNCTION update_order_totals()
RETURNS TABLE (
    orders_updated INTEGER
) AS $$
DECLARE
    v_updated INTEGER := 0;
BEGIN
    -- Update order totals from successful transactions
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
    
    GET DIAGNOSTICS v_updated = ROW_COUNT;
    
    RETURN QUERY SELECT v_updated;
END;
$$ LANGUAGE plpgsql;

-- Function 5: Main import orchestration function
CREATE OR REPLACE FUNCTION finalize_ablefy_import()
RETURNS TABLE (
    step TEXT,
    result TEXT
) AS $$
DECLARE
    v_result RECORD;
BEGIN
    -- Step 1: Link transactions to orders
    SELECT * INTO v_result FROM link_transactions_to_orders();
    RETURN QUERY SELECT 'Link Transactions to Orders'::TEXT, 
                       format('Linked: %s, Unlinked: %s', v_result.linked_count, v_result.unlinked_count)::TEXT;
    
    -- Step 2: Map courses
    SELECT * INTO v_result FROM map_courses_from_products();
    RETURN QUERY SELECT 'Map Courses from Products'::TEXT, 
                       format('Transactions: %s, Orders: %s', v_result.transactions_mapped, v_result.orders_mapped)::TEXT;
    
    -- Step 3: Link users
    SELECT * INTO v_result FROM create_users_from_transactions();
    RETURN QUERY SELECT 'Link Users'::TEXT, 
                       format('Created: %s, Linked: %s', v_result.users_created, v_result.users_linked)::TEXT;
    
    -- Step 4: Update order totals
    SELECT * INTO v_result FROM update_order_totals();
    RETURN QUERY SELECT 'Update Order Totals'::TEXT, 
                       format('Updated: %s orders', v_result.orders_updated)::TEXT;
    
    -- Step 5: Update order status based on transactions
    UPDATE orders o
    SET status = CASE 
        WHEN t.has_successful_payment THEN 'paid'
        WHEN t.has_failed_payment THEN 'failed'
        WHEN t.has_refund THEN 'refunded'
        ELSE 'pending'
    END
    FROM (
        SELECT 
            order_id,
            bool_or(status = 'Erfolgreich') as has_successful_payment,
            bool_or(status = 'Fehlgeschlagen') as has_failed_payment,
            bool_or(status = 'Erstattet') as has_refund
        FROM transactions
        WHERE order_id IS NOT NULL
        GROUP BY order_id
    ) t
    WHERE o.id = t.order_id;
    
    GET DIAGNOSTICS v_result := ROW_COUNT;
    RETURN QUERY SELECT 'Update Order Status'::TEXT, 
                       format('Updated: %s orders', v_result)::TEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS FOR IMPORT VALIDATION
-- ============================================================================

-- View: Import statistics
CREATE OR REPLACE VIEW import_statistics AS
SELECT 
    'Transactions' as entity,
    COUNT(*) as total_count,
    COUNT(CASE WHEN imported_from_ablefy THEN 1 END) as imported_count,
    COUNT(CASE WHEN order_id IS NOT NULL THEN 1 END) as linked_to_order,
    COUNT(CASE WHEN course_id IS NOT NULL THEN 1 END) as linked_to_course,
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as linked_to_user
FROM transactions
WHERE source_platform = 'ablefy'

UNION ALL

SELECT 
    'Orders' as entity,
    COUNT(*) as total_count,
    COUNT(CASE WHEN imported_from_ablefy THEN 1 END) as imported_count,
    NULL as linked_to_order,
    COUNT(CASE WHEN course_id IS NOT NULL THEN 1 END) as linked_to_course,
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as linked_to_user
FROM orders
WHERE source = 'ablefy';

-- View: Unmapped products
CREATE OR REPLACE VIEW unmapped_products AS
SELECT DISTINCT
    t.product_id,
    t.produkt as product_name,
    COUNT(*) as transaction_count,
    SUM(t.bezahlt) as total_revenue
FROM transactions t
LEFT JOIN course_mapping cm ON t.product_id = cm.ablefy_product_id
WHERE t.product_id IS NOT NULL
AND cm.id IS NULL
AND t.source_platform = 'ablefy'
GROUP BY t.product_id, t.produkt
ORDER BY COUNT(*) DESC;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
GRANT EXECUTE ON FUNCTION link_transactions_to_orders() TO service_role;
GRANT EXECUTE ON FUNCTION map_courses_from_products() TO service_role;
GRANT EXECUTE ON FUNCTION create_users_from_transactions() TO service_role;
GRANT EXECUTE ON FUNCTION update_order_totals() TO service_role;
GRANT EXECUTE ON FUNCTION finalize_ablefy_import() TO service_role;

GRANT SELECT ON import_statistics TO authenticated;
GRANT SELECT ON unmapped_products TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON FUNCTION finalize_ablefy_import IS 'Main orchestration function to finalize Ablefy import - links transactions, maps courses, creates users';
COMMENT ON VIEW import_statistics IS 'Shows import statistics for validation';
COMMENT ON VIEW unmapped_products IS 'Shows products without course mapping for cleanup';
