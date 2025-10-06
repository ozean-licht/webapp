-- ============================================================================
-- DISABLE RLS FOR DEVELOPMENT (NUCLEAR OPTION)
-- ============================================================================
-- ⚠️ NUR FÜR DEVELOPMENT! In Production RLS wieder aktivieren!
-- ============================================================================

-- Disable RLS auf allen wichtigen Tables
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- Courses hat vielleicht schon kein RLS, aber sicher ist sicher
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'courses' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Verification
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('orders', 'transactions', 'user_roles', 'courses', 'user_progress', 'user_courses')
ORDER BY tablename;

-- Success Message
SELECT 
    '⚠️ RLS DISABLED FOR DEVELOPMENT' as warning,
    'All tables are now accessible without RLS checks' as status,
    'Re-enable RLS before deploying to production!' as important;

