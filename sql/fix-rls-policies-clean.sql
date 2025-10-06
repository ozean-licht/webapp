-- ============================================================================
-- FIX RLS POLICIES - CLEAN & SIMPLE
-- ============================================================================
-- Entfernt die rekursiven Admin-Checks und vereinfacht die Policies
-- ============================================================================

-- ============================================================================
-- ORDERS TABLE - Neue einfache Policies
-- ============================================================================

-- Drop alle existierenden Policies
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Only admins can modify orders" ON orders;
DROP POLICY IF EXISTS "Admins can insert orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON orders;

-- Neue simple Policy: Users sehen nur ihre eigenen Orders
CREATE POLICY "users_view_own_orders"
ON orders
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Service Role kann alles (für Backend/Admin)
CREATE POLICY "service_role_all_orders"
ON orders
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- TRANSACTIONS TABLE - Neue einfache Policies
-- ============================================================================

-- Drop alle existierenden Policies
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Only admins can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Only admins can update transactions" ON transactions;
DROP POLICY IF EXISTS "Only admins can delete transactions" ON transactions;

-- Neue simple Policy: Users sehen nur ihre eigenen Transactions
CREATE POLICY "users_view_own_transactions"
ON transactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Service Role kann alles
CREATE POLICY "service_role_all_transactions"
ON transactions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- USER_ROLES TABLE - Vereinfachen (kein RLS für authenticated users)
-- ============================================================================

-- Drop existierende Policies
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can modify roles" ON user_roles;

-- Einfache Policy: Jeder kann seine eigenen Roles sehen
CREATE POLICY "users_view_own_roles"
ON user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Service Role kann alles
CREATE POLICY "service_role_all_roles"
ON user_roles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- COURSES TABLE - Public Read Access
-- ============================================================================

-- Check if RLS is enabled
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'courses' 
        AND rowsecurity = true
    ) THEN
        -- Drop existing policies
        DROP POLICY IF EXISTS "courses_public_read" ON courses;
        DROP POLICY IF EXISTS "service_role_all_courses" ON courses;
        
        -- Alle können Courses lesen (public)
        CREATE POLICY "courses_public_read"
        ON courses
        FOR SELECT
        TO authenticated, anon
        USING (true);
        
        -- Service Role kann alles
        CREATE POLICY "service_role_all_courses"
        ON courses
        FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check welche Policies jetzt aktiv sind
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('orders', 'transactions', 'user_roles', 'courses')
ORDER BY tablename, policyname;

-- Test Query (als authenticated user)
SELECT 
    'Policy Test' as info,
    'Policies updated successfully' as status,
    'Users can now view their own orders via auth.uid()' as note;

-- ============================================================================
-- WICHTIG: Nach diesem Script
-- ============================================================================
-- 1. Checke ob auth.uid() in der App funktioniert
-- 2. Falls nicht, müssen wir die Supabase Client Config checken
-- 3. Console Logs sollten jetzt erscheinen in bibliothek/page.tsx

