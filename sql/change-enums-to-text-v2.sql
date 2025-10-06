-- ============================================================================
-- CHANGE ENUMS TO TEXT - V2 (Views safe)
-- ============================================================================

-- Step 1: Drop Views
DROP VIEW IF EXISTS successful_transactions_with_courses CASCADE;
DROP VIEW IF EXISTS monthly_revenue CASCADE;
DROP VIEW IF EXISTS user_purchase_history CASCADE;
DROP VIEW IF EXISTS active_course_enrollments CASCADE;

-- Step 2: Change columns to TEXT
ALTER TABLE transactions 
  ALTER COLUMN status DROP DEFAULT,
  ALTER COLUMN status TYPE TEXT USING status::TEXT,
  ALTER COLUMN status SET DEFAULT 'Ausstehend';

ALTER TABLE transactions 
  ALTER COLUMN typ TYPE TEXT USING typ::TEXT;

ALTER TABLE transactions 
  ALTER COLUMN zahlungsart TYPE TEXT USING zahlungsart::TEXT;

ALTER TABLE transactions 
  ALTER COLUMN account_type TYPE TEXT USING account_type::TEXT,
  ALTER COLUMN account_type SET DEFAULT 'new';

ALTER TABLE orders 
  ALTER COLUMN status DROP DEFAULT,
  ALTER COLUMN status TYPE TEXT USING status::TEXT,
  ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE orders 
  ALTER COLUMN source TYPE TEXT USING source::TEXT;

ALTER TABLE orders 
  ALTER COLUMN account_type TYPE TEXT USING account_type::TEXT,
  ALTER COLUMN account_type SET DEFAULT 'new';

-- Step 3: Recreate Views
CREATE OR REPLACE VIEW successful_transactions_with_courses AS
SELECT 
    t.*,
    c.title as course_title_name,
    c.slug as course_slug,
    c.price as course_price
FROM transactions t
LEFT JOIN courses c ON t.course_id = c.id
WHERE t.status = 'Erfolgreich' OR t.status = 'successful'
ORDER BY t.transaction_date DESC;

CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
    DATE_TRUNC('month', transaction_date) as month,
    COUNT(*) as transaction_count,
    SUM(bezahlt) as gross_revenue,
    SUM(bezahlt_minus_fee) as net_revenue,
    SUM(fees_total) as total_fees,
    waehrung as currency
FROM transactions
WHERE status IN ('Erfolgreich', 'successful')
GROUP BY DATE_TRUNC('month', transaction_date), waehrung
ORDER BY month DESC;

CREATE OR REPLACE VIEW user_purchase_history AS
SELECT 
    user_id,
    buyer_email,
    buyer_first_name,
    buyer_last_name,
    COUNT(*) as total_purchases,
    SUM(bezahlt) as total_spent,
    MIN(transaction_date) as first_purchase,
    MAX(transaction_date) as last_purchase
FROM transactions
WHERE status IN ('Erfolgreich', 'successful')
AND user_id IS NOT NULL
GROUP BY user_id, buyer_email, buyer_first_name, buyer_last_name;

CREATE OR REPLACE VIEW active_course_enrollments AS
SELECT 
    o.user_id,
    o.buyer_email,
    o.buyer_full_name,
    o.course_id,
    o.course_title,
    o.order_date,
    o.source,
    o.amount_gross,
    COUNT(t.id) as payment_count
FROM orders o
LEFT JOIN transactions t ON t.order_id = o.id AND (t.status = 'Erfolgreich' OR t.status = 'successful')
WHERE o.status = 'paid'
AND o.course_id IS NOT NULL
GROUP BY o.id, o.user_id, o.buyer_email, o.buyer_full_name, o.course_id, o.course_title, o.order_date, o.source, o.amount_gross
ORDER BY o.order_date DESC;

-- Zeige Erfolg
SELECT 'ENUMs zu TEXT konvertiert! Views neu erstellt! ✅' as status;
