-- ============================================================================
-- SETUP AUTO-LINK TRIGGER FOR NEW USERS
-- ============================================================================
-- This creates a database trigger that automatically links orders to users
-- when they sign up or log in for the first time
-- ============================================================================

-- Step 1: Create the function that links orders
CREATE OR REPLACE FUNCTION auto_link_user_orders()
RETURNS TRIGGER AS $$
DECLARE
    v_orders_linked INTEGER;
    v_transactions_linked INTEGER;
BEGIN
    -- Link orders to the new user based on email
    UPDATE orders o
    SET user_id = NEW.id
    WHERE LOWER(o.buyer_email) = LOWER(NEW.email)
    AND o.user_id IS NULL;
    
    GET DIAGNOSTICS v_orders_linked = ROW_COUNT;
    
    -- Link transactions to the new user based on email
    UPDATE transactions t
    SET user_id = NEW.id
    WHERE LOWER(t.buyer_email) = LOWER(NEW.email)
    AND t.user_id IS NULL;
    
    GET DIAGNOSTICS v_transactions_linked = ROW_COUNT;
    
    -- Log the results
    RAISE NOTICE 'Auto-linked % orders and % transactions for user %', 
        v_orders_linked, v_transactions_linked, NEW.email;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_auto_link_user_orders ON auth.users;

-- Step 3: Create the trigger on auth.users INSERT
CREATE TRIGGER trigger_auto_link_user_orders
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION auto_link_user_orders();

-- Step 4: Verify trigger was created
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_auto_link_user_orders';

-- ============================================================================
-- TEST THE TRIGGER
-- ============================================================================
-- You can test by creating a test user (but be careful not to duplicate real emails!)
-- 
-- Example:
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
-- VALUES (
--     gen_random_uuid(),
--     'test@example.com',
--     crypt('test123', gen_salt('bf')),
--     NOW()
-- );
-- 
-- Then check if orders were linked:
-- SELECT * FROM orders WHERE LOWER(buyer_email) = 'test@example.com';
-- ============================================================================

-- Step 5: Also link existing users (one-time backfill)
DO $$
DECLARE
    v_user RECORD;
    v_total_orders INTEGER := 0;
    v_total_transactions INTEGER := 0;
BEGIN
    -- Loop through all existing users
    FOR v_user IN 
        SELECT id, email FROM auth.users
    LOOP
        -- Link orders
        UPDATE orders o
        SET user_id = v_user.id
        WHERE LOWER(o.buyer_email) = LOWER(v_user.email)
        AND o.user_id IS NULL;
        
        v_total_orders := v_total_orders + (SELECT COUNT(*) FROM orders WHERE user_id = v_user.id);
        
        -- Link transactions
        UPDATE transactions t
        SET user_id = v_user.id
        WHERE LOWER(t.buyer_email) = LOWER(v_user.email)
        AND t.user_id IS NULL;
        
        v_total_transactions := v_total_transactions + (SELECT COUNT(*) FROM transactions WHERE user_id = v_user.id);
    END LOOP;
    
    RAISE NOTICE 'Backfill complete: Linked % orders and % transactions', 
        v_total_orders, v_total_transactions;
END $$;

-- Step 6: Final verification
SELECT 
    'Summary' as info,
    COUNT(DISTINCT user_id) as users_with_orders,
    COUNT(*) as total_orders,
    COUNT(*) FILTER (WHERE user_id IS NOT NULL) as linked_orders,
    COUNT(*) FILTER (WHERE user_id IS NULL) as unlinked_orders
FROM orders;

-- Step 7: Show orders per user
SELECT 
    u.email,
    COUNT(o.id) as order_count,
    COUNT(o.id) FILTER (WHERE o.status = 'paid') as paid_orders,
    COUNT(o.id) FILTER (WHERE o.course_id IS NOT NULL) as orders_with_courses
FROM auth.users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.email
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC;

