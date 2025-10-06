-- ===============================================
-- FIX ALL TRANSACTION CONSTRAINTS
-- ===============================================
-- Entfernt oder setzt DEFAULT für problematische NOT NULL constraints
-- Ermöglicht N8N/Webhooks Transaktionen mit fehlenden Feldern zu senden

-- 1. transaction_date - nullable mit DEFAULT
-- =====================================================
ALTER TABLE transactions 
ALTER COLUMN transaction_date DROP NOT NULL;

ALTER TABLE transactions 
ALTER COLUMN transaction_date SET DEFAULT NOW();

UPDATE transactions
SET transaction_date = created_at
WHERE transaction_date IS NULL;

-- 2. bezahlt - nullable mit DEFAULT 0
-- =====================================================
ALTER TABLE transactions 
ALTER COLUMN bezahlt DROP NOT NULL;

ALTER TABLE transactions 
ALTER COLUMN bezahlt SET DEFAULT 0;

UPDATE transactions
SET bezahlt = 0
WHERE bezahlt IS NULL;

-- 3. faelliger_betrag - nullable mit DEFAULT 0
-- =====================================================
ALTER TABLE transactions 
ALTER COLUMN faelliger_betrag DROP NOT NULL;

ALTER TABLE transactions 
ALTER COLUMN faelliger_betrag SET DEFAULT 0;

UPDATE transactions
SET faelliger_betrag = 0
WHERE faelliger_betrag IS NULL;

-- 4. fees_total - nullable mit DEFAULT 0
-- =====================================================
ALTER TABLE transactions 
ALTER COLUMN fees_total DROP NOT NULL;

ALTER TABLE transactions 
ALTER COLUMN fees_total SET DEFAULT 0;

UPDATE transactions
SET fees_total = 0
WHERE fees_total IS NULL;

-- 5. vat_rate - nullable mit DEFAULT 0
-- =====================================================
ALTER TABLE transactions 
ALTER COLUMN vat_rate DROP NOT NULL;

ALTER TABLE transactions 
ALTER COLUMN vat_rate SET DEFAULT 0;

UPDATE transactions
SET vat_rate = 0
WHERE vat_rate IS NULL;

-- 6. ust - nullable mit DEFAULT 0
-- =====================================================
ALTER TABLE transactions 
ALTER COLUMN ust DROP NOT NULL;

ALTER TABLE transactions 
ALTER COLUMN ust SET DEFAULT 0;

UPDATE transactions
SET ust = 0
WHERE ust IS NULL;

-- 7. waehrung - nullable mit DEFAULT 'EUR'
-- =====================================================
ALTER TABLE transactions 
ALTER COLUMN waehrung DROP NOT NULL;

ALTER TABLE transactions 
ALTER COLUMN waehrung SET DEFAULT 'EUR';

UPDATE transactions
SET waehrung = 'EUR'
WHERE waehrung IS NULL;

-- 8. buyer_email - MUSS vorhanden sein, aber fallback
-- =====================================================
-- Setze DEFAULT für buyer_email (sollte immer gesetzt werden, aber Fallback)
ALTER TABLE transactions 
ALTER COLUMN buyer_email DROP NOT NULL;

ALTER TABLE transactions 
ALTER COLUMN buyer_email SET DEFAULT 'unknown@unknown.com';

-- 9. status - nullable mit DEFAULT 'Ausstehend'
-- =====================================================
ALTER TABLE transactions 
ALTER COLUMN status DROP NOT NULL;

ALTER TABLE transactions 
ALTER COLUMN status SET DEFAULT 'Ausstehend';

UPDATE transactions
SET status = 'Ausstehend'
WHERE status IS NULL;

-- Verification
-- =====================================================
SELECT 
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'transactions'
  AND column_name IN (
    'transaction_date',
    'bezahlt',
    'faelliger_betrag',
    'fees_total',
    'vat_rate',
    'ust',
    'waehrung',
    'buyer_email',
    'status'
  )
ORDER BY ordinal_position;

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE '✅ All transaction constraints fixed!';
  RAISE NOTICE '';
  RAISE NOTICE 'Nullable with defaults:';
  RAISE NOTICE '  - transaction_date: NOW()';
  RAISE NOTICE '  - bezahlt: 0';
  RAISE NOTICE '  - faelliger_betrag: 0';
  RAISE NOTICE '  - fees_total: 0';
  RAISE NOTICE '  - vat_rate: 0';
  RAISE NOTICE '  - ust: 0';
  RAISE NOTICE '  - waehrung: EUR';
  RAISE NOTICE '  - buyer_email: unknown@unknown.com';
  RAISE NOTICE '  - status: Ausstehend';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Ready for N8N/Webhook transactions!';
END $$;
