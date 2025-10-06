-- ============================================================================
-- RECREATE TRANSACTIONS TABLE WITH CORRECT SCHEMA
-- ============================================================================
-- Purpose: Drop and recreate transactions table with all Ablefy fields
-- Created: 07. Oktober 2025
-- ============================================================================

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Recreate ENUMs if they don't exist
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
    CREATE TYPE account_type AS ENUM ('old', 'new');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'paid', 'partial', 'failed', 'refunded', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_source AS ENUM ('ablefy', 'stripe', 'manual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Now recreate orders table
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

-- Now recreate transactions table
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

-- Create indexes
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
