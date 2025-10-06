-- ===============================================
-- DEBUG AND FIX TRIGGER
-- ===============================================

-- 1. Make trx_id nullable (subscription_state_changed has no trx_id)
-- =====================================================
ALTER TABLE transactions 
ALTER COLUMN trx_id DROP NOT NULL;

-- Change unique constraint to allow NULLs
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_trx_id_key;
CREATE UNIQUE INDEX transactions_trx_id_key ON transactions(trx_id) WHERE trx_id IS NOT NULL;

-- 2. Fix Trigger to properly set course_id
-- =====================================================

DROP TRIGGER IF EXISTS trg_auto_create_order ON transactions;
DROP FUNCTION IF EXISTS auto_create_order_from_transaction();

CREATE OR REPLACE FUNCTION auto_create_order_from_transaction()
RETURNS TRIGGER AS $$
DECLARE
  v_order_id UUID;
  v_course_id INTEGER;
  v_total_gross DECIMAL;
  v_total_fees DECIMAL;
  v_transaction_count INTEGER;
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
    
    RAISE NOTICE 'Creating order for order_number: %', NEW.order_number;
    
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

    RAISE NOTICE 'Created order % for transaction', v_order_id;

  ELSE
    RAISE NOTICE 'Order already exists: %', v_order_id;
  END IF;

  -- Link transaction to order
  NEW.order_id := v_order_id;

  -- Mappe Course ID - WICHTIG: Mache das für TRANSACTION
  IF NEW.product_id IS NOT NULL THEN
    SELECT course_id INTO v_course_id
    FROM course_mapping
    WHERE ablefy_product_id = NEW.product_id
      AND is_active = true
    LIMIT 1;

    IF v_course_id IS NOT NULL THEN
      RAISE NOTICE 'Found course_id % for product_id %', v_course_id, NEW.product_id;
      
      -- Setze course_id in TRANSACTION
      NEW.course_id := v_course_id;
      
      -- Update auch Order (falls noch nicht gesetzt)
      UPDATE orders
      SET course_id = v_course_id
      WHERE id = v_order_id
        AND course_id IS NULL;
        
      RAISE NOTICE 'Set course_id % on transaction and order', v_course_id;
    ELSE
      RAISE NOTICE 'No course mapping found for product_id %', NEW.product_id;
    END IF;
  ELSE
    RAISE NOTICE 'product_id is NULL';
  END IF;

  -- Update order totals
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

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER trg_auto_create_order
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_order_from_transaction();

-- 3. Update existing transactions to set course_id
-- =====================================================
UPDATE transactions t
SET course_id = cm.course_id
FROM course_mapping cm
WHERE t.product_id = cm.ablefy_product_id
  AND cm.is_active = true
  AND t.course_id IS NULL
  AND t.product_id IS NOT NULL;

-- Update existing orders to set course_id
UPDATE orders o
SET course_id = cm.course_id
FROM course_mapping cm
WHERE o.ablefy_product_id = cm.ablefy_product_id::TEXT
  AND cm.is_active = true
  AND o.course_id IS NULL
  AND o.ablefy_product_id IS NOT NULL;

-- Verification
SELECT 
  COUNT(*) as total_transactions,
  COUNT(course_id) as with_course_id,
  COUNT(*) - COUNT(course_id) as without_course_id
FROM transactions
WHERE product_id IS NOT NULL;

SELECT 
  COUNT(*) as total_orders,
  COUNT(course_id) as with_course_id,
  COUNT(*) - COUNT(course_id) as without_course_id
FROM orders
WHERE ablefy_product_id IS NOT NULL;

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE '✅ Trigger fixed and existing data updated!';
  RAISE NOTICE '✅ trx_id is now nullable';
  RAISE NOTICE '✅ course_id mapping now works in trigger';
END $$;
