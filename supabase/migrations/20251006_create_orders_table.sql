-- ============================================================================
-- UNIFIED ORDERS TABLE
-- ============================================================================
-- Purpose: Store ALL orders - both Ablefy (legacy) AND Stripe (new)
-- Source: Airtable ablefy_orders + future Stripe orders
-- Note: NO separate ablefy_orders table - unified approach!
-- ============================================================================

-- Create ENUM types (if not already exist)
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
      'pending',        -- Order created, awaiting payment
      'paid',           -- Fully paid
      'partial',        -- Partially paid (Ratenzahlung)
      'failed',         -- Payment failed
      'refunded',       -- Refunded
      'cancelled'       -- Cancelled
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_source AS ENUM ('ablefy', 'stripe', 'manual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_type AS ENUM ('old', 'new'); -- old = Ablefy, new = Direct Stripe
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE orders (
  -- ============================================================================
  -- PRIMARY IDENTIFIERS
  -- ============================================================================
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Source-specific order numbers
  ablefy_order_number BIGINT UNIQUE, -- For Ablefy legacy orders
  stripe_payment_intent_id TEXT UNIQUE, -- For Stripe orders
  
  -- Universal order number (generated)
  order_number TEXT UNIQUE NOT NULL GENERATED ALWAYS AS (
    CASE 
      WHEN ablefy_order_number IS NOT NULL THEN 'ABL-' || ablefy_order_number::TEXT
      WHEN stripe_payment_intent_id IS NOT NULL THEN 'STR-' || stripe_payment_intent_id
      ELSE 'ORD-' || id::TEXT
    END
  ) STORED,
  
  -- Invoice ID
  invoice_id TEXT,
  
  -- ============================================================================
  -- ORDER SOURCE & TYPE
  -- ============================================================================
  source order_source NOT NULL, -- 'ablefy', 'stripe', 'manual'
  account_type account_type NOT NULL DEFAULT 'new', -- 'old' = Ablefy, 'new' = Stripe
  
  -- ============================================================================
  -- BUYER INFORMATION
  -- ============================================================================
  buyer_email TEXT NOT NULL,
  buyer_first_name TEXT,
  buyer_last_name TEXT,
  buyer_full_name TEXT GENERATED ALWAYS AS (
    TRIM(COALESCE(buyer_first_name, '') || ' ' || COALESCE(buyer_last_name, ''))
  ) STORED,
  
  -- ============================================================================
  -- ORDER DATA
  -- ============================================================================
  order_date TIMESTAMPTZ NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  
  -- ============================================================================
  -- PRODUCT & COURSE
  -- ============================================================================
  -- Ablefy Legacy
  ablefy_product_id TEXT, -- Ablefy product ID (can be string or number)
  
  -- Unified Course Reference
  course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
  course_title TEXT, -- Denormalized for convenience
  
  -- Stripe Product (future)
  stripe_product_id TEXT, -- Stripe Product ID
  stripe_price_id TEXT, -- Stripe Price ID
  
  -- ============================================================================
  -- FINANCIAL DATA
  -- ============================================================================
  -- Core amounts
  amount_net DECIMAL(10, 2), -- Net amount
  amount_gross DECIMAL(10, 2), -- Gross amount (sum from transactions)
  amount_minus_fees DECIMAL(10, 2), -- After fees
  initial_amount DECIMAL(10, 2), -- Original total (for payment plans)
  
  -- Fees (aggregated from transactions)
  fees_total DECIMAL(10, 2) DEFAULT 0,
  
  -- Transaction tracking
  transactions_count INTEGER DEFAULT 0,
  
  -- Currency
  currency TEXT DEFAULT 'EUR',
  
  -- ============================================================================
  -- USER RELATIONSHIP
  -- ============================================================================
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- ============================================================================
  -- METADATA
  -- ============================================================================
  -- For gift orders
  is_gift BOOLEAN DEFAULT FALSE,
  recipient_name TEXT,
  recipient_email TEXT,
  
  -- Notes
  admin_notes TEXT,
  
  -- ============================================================================
  -- AUDIT & TIMESTAMPS
  -- ============================================================================
  imported_from_ablefy BOOLEAN DEFAULT FALSE,
  imported_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_orders_ablefy_order_number ON orders(ablefy_order_number) WHERE ablefy_order_number IS NOT NULL;
CREATE INDEX idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX idx_orders_buyer_email ON orders(buyer_email);
CREATE INDEX idx_orders_course_id ON orders(course_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_source ON orders(source);

-- Composite indexes
CREATE INDEX idx_orders_email_status ON orders(buyer_email, status);
CREATE INDEX idx_orders_course_status ON orders(course_id, status) WHERE course_id IS NOT NULL;

-- ============================================================================
-- TRIGGER
-- ============================================================================
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Admins can see all orders
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

-- Users can see their own orders
CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Only admins can modify orders
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
-- VIEWS
-- ============================================================================

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
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE orders IS 'Unified orders table for Ablefy (legacy) and Stripe (new) - NO separate ablefy_orders!';
COMMENT ON COLUMN orders.source IS 'ablefy = legacy import, stripe = new payments, manual = admin created';
COMMENT ON COLUMN orders.account_type IS 'old = Ablefy era, new = Stripe era';
COMMENT ON COLUMN orders.order_number IS 'Auto-generated: ABL-xxx for Ablefy, STR-xxx for Stripe';
COMMENT ON FUNCTION get_user_course_access IS 'Returns all courses a user has access to via paid orders';
COMMENT ON FUNCTION user_has_course_access IS 'Check if user has paid access to specific course';
