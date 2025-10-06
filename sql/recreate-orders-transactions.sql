-- ============================================================================
-- RECREATE ORDERS AND TRANSACTIONS TABLES
-- ============================================================================
-- Run this in Supabase SQL Editor to fix table structure
-- WARNING: This will delete all existing data in orders and transactions!
-- ============================================================================

-- Drop existing tables (transactions first due to foreign key)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Recreate orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ablefy_order_number BIGINT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  order_number TEXT UNIQUE NOT NULL GENERATED ALWAYS AS (
    CASE 
      WHEN ablefy_order_number IS NOT NULL THEN 'ABL-' || ablefy_order_number::TEXT
      WHEN stripe_payment_intent_id IS NOT NULL THEN 'STR-' || stripe_payment_intent_id
      ELSE 'ORD-' || id::TEXT
    END
  ) STORED,
  invoice_id TEXT,
  source order_source NOT NULL,
  account_type account_type NOT NULL DEFAULT 'new',
  buyer_email TEXT NOT NULL,
  buyer_first_name TEXT,
  buyer_last_name TEXT,
  buyer_full_name TEXT GENERATED ALWAYS AS (
    TRIM(COALESCE(buyer_first_name, '') || ' ' || COALESCE(buyer_last_name, ''))
  ) STORED,
  order_date TIMESTAMPTZ NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  ablefy_product_id TEXT,
  course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
  course_title TEXT,
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  amount_net DECIMAL(10, 2),
  amount_gross DECIMAL(10, 2),
  amount_minus_fees DECIMAL(10, 2),
  initial_amount DECIMAL(10, 2),
  fees_total DECIMAL(10, 2) DEFAULT 0,
  transactions_count INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_gift BOOLEAN DEFAULT FALSE,
  recipient_name TEXT,
  recipient_email TEXT,
  admin_notes TEXT,
  imported_from_ablefy BOOLEAN DEFAULT FALSE,
  imported_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trx_id BIGINT UNIQUE,
  relevante_id TEXT,
  rechnungsnummer TEXT,
  invoice_number TEXT GENERATED ALWAYS AS (rechnungsnummer) STORED,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  transaction_date TIMESTAMPTZ NOT NULL,
  datum_raw TEXT,
  erfolgt_am TEXT,
  status transaction_status NOT NULL DEFAULT 'Ausstehend',
  typ transaction_type NOT NULL,
  zahlungsart payment_method NOT NULL,
  order_number BIGINT,
  product_id INTEGER,
  produkt TEXT,
  psp TEXT,
  course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
  faelliger_betrag DECIMAL(10, 2) NOT NULL,
  bezahlt DECIMAL(10, 2) NOT NULL,
  bezahlt_minus_fee DECIMAL(10, 2),
  netto DECIMAL(10, 2),
  einnahmen_netto DECIMAL(10, 2),
  fees_total DECIMAL(10, 2) DEFAULT 0,
  fees_service DECIMAL(10, 2) DEFAULT 0,
  fees_payment_provider DECIMAL(10, 2) DEFAULT 0,
  vat_rate DECIMAL(4, 1) DEFAULT 0,
  ust DECIMAL(10, 2) DEFAULT 0,
  steuerkategorie TEXT,
  waehrung TEXT DEFAULT 'EUR',
  plan TEXT,
  zahlungsplan_id BIGINT,
  faelligkeiten_id BIGINT,
  gutscheincode TEXT,
  buyer_email TEXT NOT NULL,
  buyer_first_name TEXT,
  buyer_last_name TEXT,
  buyer_phone TEXT,
  buyer_land TEXT,
  buyer_stadt TEXT,
  buyer_strasse TEXT,
  buyer_hausnummer TEXT,
  buyer_plz INTEGER,
  buyer_adress_zusatz TEXT,
  buyer_country_code TEXT,
  buyer_ust_id TEXT,
  buyer_unternehmen TEXT,
  recipient_name TEXT,
  recipient_email TEXT,
  recipient_phone TEXT,
  recipient_land TEXT,
  recipient_strasse TEXT,
  recipient_hausnummer TEXT,
  recipient_firma TEXT,
  rechnungs_id BIGINT,
  rechnungsdatum TEXT,
  ext_id TEXT,
  gutschrift TEXT,
  account_type account_type NOT NULL DEFAULT 'new',
  source_platform TEXT DEFAULT 'ablefy',
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  imported_from_ablefy BOOLEAN DEFAULT FALSE,
  imported_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for transactions
CREATE INDEX idx_transactions_trx_id ON transactions(trx_id);
CREATE INDEX idx_transactions_order_number ON transactions(order_number);
CREATE INDEX idx_transactions_buyer_email ON transactions(buyer_email);
CREATE INDEX idx_transactions_transaction_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_product_id ON transactions(product_id);
CREATE INDEX idx_transactions_course_id ON transactions(course_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_account_type ON transactions(account_type);
CREATE INDEX idx_transactions_source_platform ON transactions(source_platform);
CREATE INDEX idx_transactions_email_status ON transactions(buyer_email, status);
CREATE INDEX idx_transactions_date_status ON transactions(transaction_date, status);

-- Create indexes for orders
CREATE INDEX idx_orders_ablefy_order_number ON orders(ablefy_order_number) WHERE ablefy_order_number IS NOT NULL;
CREATE INDEX idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX idx_orders_buyer_email ON orders(buyer_email);
CREATE INDEX idx_orders_course_id ON orders(course_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_source ON orders(source);
CREATE INDEX idx_orders_email_status ON orders(buyer_email, status);
CREATE INDEX idx_orders_course_status ON orders(course_id, status) WHERE course_id IS NOT NULL;

-- Create triggers
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
CREATE POLICY "Admins can view all transactions"
    ON transactions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Only admins can insert transactions"
    ON transactions FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can update transactions"
    ON transactions FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- RLS Policies for orders
CREATE POLICY "Admins can view all orders"
    ON orders FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Only admins can modify orders"
    ON orders FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- ============================================================================
-- CREATE VIEWS
-- ============================================================================

-- View: Successful Transactions with Course Info
CREATE OR REPLACE VIEW successful_transactions_with_courses AS
SELECT 
    t.*,
    c.title as course_title,
    c.slug as course_slug,
    c.price as course_price
FROM transactions t
LEFT JOIN courses c ON t.course_id = c.id
WHERE t.status = 'Erfolgreich'
ORDER BY t.transaction_date DESC;

-- View: Monthly Revenue Report
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
    DATE_TRUNC('month', transaction_date) as month,
    COUNT(*) as transaction_count,
    SUM(bezahlt) as gross_revenue,
    SUM(bezahlt_minus_fee) as net_revenue,
    SUM(fees_total) as total_fees,
    waehrung as currency
FROM transactions
WHERE status = 'Erfolgreich'
GROUP BY DATE_TRUNC('month', transaction_date), waehrung
ORDER BY month DESC;

-- View: Active Course Enrollments
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
LEFT JOIN transactions t ON t.order_id = o.id AND t.status = 'Erfolgreich'
WHERE o.status = 'paid'
AND o.course_id IS NOT NULL
GROUP BY o.id, o.user_id, o.buyer_email, o.buyer_full_name, o.course_id, o.course_title, o.order_date, o.source, o.amount_gross
ORDER BY o.order_date DESC;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function: Get course access for user based on orders
CREATE OR REPLACE FUNCTION get_user_course_access(p_user_id UUID)
RETURNS TABLE (
    course_id BIGINT,
    course_title TEXT,
    purchase_date TIMESTAMPTZ,
    source TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        o.course_id,
        o.course_title,
        o.order_date as purchase_date,
        o.source::TEXT
    FROM orders o
    WHERE o.user_id = p_user_id
    AND o.status = 'paid'
    AND o.course_id IS NOT NULL
    ORDER BY o.order_date DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function: Check if user has access to course
CREATE OR REPLACE FUNCTION user_has_course_access(p_user_id UUID, p_course_id BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM orders
        WHERE user_id = p_user_id
        AND course_id = p_course_id
        AND status = 'paid'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================================
-- SUCCESS!
-- ============================================================================
SELECT 'Orders and Transactions tables recreated successfully!' as status;
