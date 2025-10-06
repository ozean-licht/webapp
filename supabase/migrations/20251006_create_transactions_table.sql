-- ============================================================================
-- UNIFIED TRANSACTIONS TABLE
-- ============================================================================
-- Purpose: Store ALL transactions - both Ablefy (legacy) AND Stripe (new)
-- Migration Date: 06. Oktober 2025
-- Source: Airtable ablefy_transactions (legacy) + Stripe webhooks (future)
-- Note: NO separate ablefy_transactions table - unified approach!
-- ============================================================================

-- Create ENUM types for better type safety (if not already exist)
DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('Erfolgreich', 'Ausstehend', 'Fehlgeschlagen', 'Erstattet', 'Storniert');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('Zahlungseingang', 'Erstattung', 'Gutschrift', 'Storno');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('PayPal', 'Kreditkarte', 'Vorkasse', 'Stripe', 'SEPA', 'Sofortüberweisung', 'Kostenlos', 'Klarna', 'Apple Pay', 'Google Pay', 'Bankkonto');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_type AS ENUM ('old', 'new'); -- old = Ablefy, new = Direct Stripe
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Main Transactions Table
CREATE TABLE transactions (
  -- ============================================================================
  -- PRIMARY IDENTIFIERS
  -- ============================================================================
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Ablefy Legacy IDs (nullable for future Stripe transactions)
  trx_id BIGINT UNIQUE, -- Ablefy transaction ID
  relevante_id TEXT, -- Ablefy relevant ID
  rechnungsnummer TEXT, -- Invoice number (e.g., "LOVE-002512")
  invoice_number TEXT GENERATED ALWAYS AS (rechnungsnummer) STORED, -- Alias for clarity
  
  -- Stripe IDs (for future Stripe transactions)
  stripe_payment_intent_id TEXT UNIQUE, -- Stripe PaymentIntent ID
  stripe_charge_id TEXT, -- Stripe Charge ID
  
  -- ============================================================================
  -- TRANSACTION CORE DATA
  -- ============================================================================
  transaction_date TIMESTAMPTZ NOT NULL, -- Parsed from datum field
  datum_raw TEXT, -- Original date string from Ablefy
  erfolgt_am TEXT, -- Transaction completion raw string
  
  status transaction_status NOT NULL DEFAULT 'Ausstehend',
  typ transaction_type NOT NULL,
  zahlungsart payment_method NOT NULL,
  
  -- ============================================================================
  -- ORDER & PRODUCT INFORMATION
  -- ============================================================================
  order_number BIGINT, -- Ablefy order number
  product_id INTEGER, -- Ablefy product ID
  produkt TEXT, -- Product name from Ablefy
  psp TEXT, -- Payment Service Provider (e.g., "paypal_rest", "ablefy_connect")
  
  -- Course mapping (will be filled via course_mapping table)
  course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
  
  -- ============================================================================
  -- FINANCIAL DATA
  -- ============================================================================
  -- Amounts
  faelliger_betrag DECIMAL(10, 2) NOT NULL, -- Total amount due
  bezahlt DECIMAL(10, 2) NOT NULL, -- Amount paid
  bezahlt_minus_fee DECIMAL(10, 2), -- Amount after fees
  netto DECIMAL(10, 2), -- Net amount
  einnahmen_netto DECIMAL(10, 2), -- Net revenue
  
  -- Fees
  fees_total DECIMAL(10, 2) DEFAULT 0,
  fees_service DECIMAL(10, 2) DEFAULT 0,
  fees_payment_provider DECIMAL(10, 2) DEFAULT 0,
  
  -- Tax
  vat_rate DECIMAL(4, 1) DEFAULT 0, -- VAT rate (e.g., 19.0 for 19%)
  ust DECIMAL(10, 2) DEFAULT 0, -- VAT amount
  steuerkategorie TEXT, -- Tax category (e.g., "digital")
  
  -- Currency
  waehrung TEXT DEFAULT 'EUR', -- Currency code
  
  -- Payment Plan
  plan TEXT, -- "Einmal" or "Ratenzahlung"
  zahlungsplan_id BIGINT, -- Payment plan ID
  faelligkeiten_id BIGINT, -- Installment ID
  
  -- Discount
  gutscheincode TEXT, -- Coupon code (e.g., "COMMUNITYLOVE")
  
  -- ============================================================================
  -- BUYER INFORMATION (Käufer)
  -- ============================================================================
  buyer_email TEXT NOT NULL,
  buyer_first_name TEXT,
  buyer_last_name TEXT,
  buyer_phone TEXT,
  
  -- Billing Address
  buyer_land TEXT,
  buyer_stadt TEXT,
  buyer_strasse TEXT,
  buyer_hausnummer TEXT,
  buyer_plz INTEGER,
  buyer_adress_zusatz TEXT,
  buyer_country_code TEXT, -- ISO country code (e.g., "DE", "CH")
  buyer_ust_id TEXT, -- VAT ID for businesses
  buyer_unternehmen TEXT, -- Company name
  
  -- ============================================================================
  -- RECIPIENT INFORMATION (Empfänger) - for gifts
  -- ============================================================================
  recipient_name TEXT,
  recipient_email TEXT,
  recipient_phone TEXT,
  recipient_land TEXT,
  recipient_strasse TEXT,
  recipient_hausnummer TEXT,
  recipient_firma TEXT,
  
  -- ============================================================================
  -- ACCOUNTING & METADATA
  -- ============================================================================
  rechnungs_id BIGINT, -- Invoice ID
  rechnungsdatum TEXT, -- Invoice date raw
  ext_id TEXT, -- External ID (PayPal transaction ID, Stripe ID, etc.)
  gutschrift TEXT, -- Credit note info
  
  -- Account Type (old = Ablefy legacy, new = Stripe)
  account_type account_type NOT NULL DEFAULT 'new',
  
  -- Source platform
  source_platform TEXT DEFAULT 'ablefy', -- 'ablefy', 'stripe', 'manual'
  
  -- ============================================================================
  -- RELATIONSHIPS
  -- ============================================================================
  -- Link to unified orders table (both Ablefy AND Stripe)
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  -- Link to user (once users are created)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- ============================================================================
  -- AUDIT & TIMESTAMPS
  -- ============================================================================
  imported_from_ablefy BOOLEAN DEFAULT FALSE,
  imported_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX idx_transactions_trx_id ON transactions(trx_id);
CREATE INDEX idx_transactions_order_number ON transactions(order_number);
CREATE INDEX idx_transactions_buyer_email ON transactions(buyer_email);
CREATE INDEX idx_transactions_transaction_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_product_id ON transactions(product_id);
CREATE INDEX idx_transactions_course_id ON transactions(course_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_stripe_payment_intent ON transactions(stripe_payment_intent_id);
CREATE INDEX idx_transactions_account_type ON transactions(account_type);
CREATE INDEX idx_transactions_source_platform ON transactions(source_platform);

-- Composite indexes for common queries
CREATE INDEX idx_transactions_email_status ON transactions(buyer_email, status);
CREATE INDEX idx_transactions_date_status ON transactions(transaction_date, status);

-- ============================================================================
-- TRIGGERS for updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Admin can see all transactions
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

-- Users can see their own transactions
CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Only admins can insert/update/delete
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

-- ============================================================================
-- VIEWS for Common Queries
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

-- View: User Purchase History
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
WHERE status = 'Erfolgreich'
AND user_id IS NOT NULL
GROUP BY user_id, buyer_email, buyer_first_name, buyer_last_name;

-- ============================================================================
-- COMMENTS for Documentation
-- ============================================================================
COMMENT ON TABLE transactions IS 'Stores all transactions from Ablefy (legacy) and Stripe (new)';
COMMENT ON COLUMN transactions.trx_id IS 'Ablefy legacy transaction ID (unique)';
COMMENT ON COLUMN transactions.stripe_payment_intent_id IS 'Stripe PaymentIntent ID for new transactions';
COMMENT ON COLUMN transactions.account_type IS 'old = Ablefy legacy, new = Stripe';
COMMENT ON COLUMN transactions.source_platform IS 'ablefy, stripe, or manual';
COMMENT ON COLUMN transactions.course_id IS 'Links to courses table via product_id mapping';
COMMENT ON COLUMN transactions.user_id IS 'Links to auth.users once users are created from emails';

