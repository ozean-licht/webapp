-- ===============================================
-- AUTO ORDER CREATION SETUP
-- ===============================================
-- Erstellt automatisch Orders aus Transactions
-- Funktioniert für Ablefy UND Stripe

-- 1. Create Database Webhook für auto-create-order Function
-- ===============================================
-- ACHTUNG: Dies muss in der Supabase Dashboard UI gemacht werden!
-- 
-- Dashboard → Database → Webhooks → Create a new hook
--
-- Settings:
--   Name: auto-create-orders
--   Table: transactions
--   Events: INSERT
--   Type: HTTP Request
--   Method: POST
--   URL: https://YOUR_PROJECT_REF.supabase.co/functions/v1/auto-create-order
--   HTTP Headers:
--     Authorization: Bearer YOUR_SUPABASE_ANON_KEY
--     Content-Type: application/json


-- 2. Alternative: PL/pgSQL Trigger Function (falls Webhooks nicht verfügbar)
-- ===============================================

-- Function die automatisch Order erstellt
CREATE OR REPLACE FUNCTION auto_create_order_from_transaction()
RETURNS TRIGGER AS $$
DECLARE
  v_order_id UUID;
  v_course_id INTEGER;
  v_total_gross DECIMAL;
  v_total_fees DECIMAL;
  v_transaction_count INTEGER;
  v_user_id UUID;
BEGIN
  -- Nur wenn order_number vorhanden ist
  IF NEW.order_number IS NULL THEN
    RETURN NEW;
  END IF;

  -- Check ob Order bereits existiert
  SELECT id INTO v_order_id
  FROM orders
  WHERE ablefy_order_number = NEW.order_number
  LIMIT 1;

  -- Wenn Order nicht existiert, erstellen
  IF v_order_id IS NULL THEN
    
    -- Erstelle neue Order
    INSERT INTO orders (
      ablefy_order_number,
      buyer_email,
      buyer_first_name,
      buyer_last_name,
      order_date,
      status,
      ablefy_product_id,
      source,
      account_type,
      currency,
      imported_from_ablefy
    ) VALUES (
      NEW.order_number,
      NEW.buyer_email,
      NEW.buyer_first_name,
      NEW.buyer_last_name,
      COALESCE(NEW.transaction_date, NOW()),
      CASE 
        WHEN NEW.status IN ('Erfolgreich', 'successful') THEN 'paid'
        ELSE 'pending'
      END,
      NEW.product_id::TEXT,
      COALESCE(NEW.source_platform, 'ablefy'),
      COALESCE(NEW.account_type, 'new'),
      'EUR',
      false
    )
    RETURNING id INTO v_order_id;

    RAISE NOTICE 'Created order % for transaction %', v_order_id, NEW.trx_id;

    -- Mappe Course ID falls vorhanden
    IF NEW.product_id IS NOT NULL THEN
      SELECT course_id INTO v_course_id
      FROM course_mapping
      WHERE ablefy_product_id = NEW.product_id
        AND is_active = true
      LIMIT 1;

      IF v_course_id IS NOT NULL THEN
        UPDATE orders
        SET course_id = v_course_id
        WHERE id = v_order_id;

        RAISE NOTICE 'Mapped course % to order %', v_course_id, v_order_id;
      END IF;
    END IF;

  END IF;

  -- Link transaction to order
  NEW.order_id := v_order_id;

  -- Update order totals (calculate from all transactions with same order_number)
  SELECT 
    COALESCE(SUM(bezahlt), 0),
    COALESCE(SUM(fees_total), 0),
    COUNT(*)
  INTO v_total_gross, v_total_fees, v_transaction_count
  FROM transactions
  WHERE order_number = NEW.order_number;

  UPDATE orders
  SET 
    amount_gross = v_total_gross,
    fees_total = v_total_fees,
    amount_minus_fees = v_total_gross - v_total_fees,
    transactions_count = v_transaction_count,
    updated_at = NOW()
  WHERE id = v_order_id;

  -- Try to link to user if exists
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(email) = LOWER(NEW.buyer_email)
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    NEW.user_id := v_user_id;
    
    UPDATE orders
    SET user_id = v_user_id
    WHERE id = v_order_id AND user_id IS NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trg_auto_create_order ON transactions;

-- Create trigger auf transactions table
CREATE TRIGGER trg_auto_create_order
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_order_from_transaction();

-- 3. Verification Queries
-- ===============================================

-- Check ob Trigger existiert
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trg_auto_create_order';

-- Test: Insert a transaction (should auto-create order)
-- Achtung: Nur zum Testen! Nicht in Production ausführen.
/*
INSERT INTO transactions (
  trx_id,
  order_number,
  buyer_email,
  transaction_date,
  status,
  product_id,
  produkt,
  bezahlt,
  source_platform,
  account_type
) VALUES (
  999999998,  -- Unique test ID
  99999998,   -- Unique test order
  'test@example.com',
  NOW(),
  'Erfolgreich',
  419336,
  'Test Product',
  99.00,
  'ablefy',
  'new'
);

-- Check ob Order erstellt wurde
SELECT * FROM orders WHERE ablefy_order_number = 99999998;

-- Cleanup test data
DELETE FROM transactions WHERE trx_id = 999999998;
DELETE FROM orders WHERE ablefy_order_number = 99999998;
*/

-- 4. Monitoring Query
-- ===============================================

-- Prüfe Transactions ohne Orders (sollten 0 sein nach Setup)
SELECT COUNT(*) as transactions_without_orders
FROM transactions
WHERE order_number IS NOT NULL
  AND order_id IS NULL;

-- Zeige letzte 10 erstellte Orders
SELECT 
  o.id,
  o.ablefy_order_number,
  o.buyer_email,
  o.course_id,
  o.status,
  o.created_at,
  COUNT(t.id) as transaction_count
FROM orders o
LEFT JOIN transactions t ON t.order_id = o.id
WHERE o.created_at > NOW() - INTERVAL '1 day'
GROUP BY o.id
ORDER BY o.created_at DESC
LIMIT 10;
