-- ============================================================================
-- CHANGE ENUMS TO TEXT FOR FLEXIBILITY
-- ============================================================================
-- Ablefy sendet verschiedene Werte, TEXT ist flexibler
-- ============================================================================

-- Drop constraints und ändere zu TEXT
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

-- Add check constraints für wichtige Werte (optional, aber nicht strikt)
ALTER TABLE transactions
  ADD CONSTRAINT check_status_reasonable CHECK (
    status IN ('Erfolgreich', 'Ausstehend', 'Fehlgeschlagen', 'Erstattet', 'Storniert', 'successful', 'pending', 'failed', 'refunded', 'cancelled')
    OR status IS NOT NULL
  );

ALTER TABLE orders
  ADD CONSTRAINT check_status_reasonable CHECK (
    status IN ('pending', 'paid', 'partial', 'failed', 'refunded', 'cancelled')
    OR status IS NOT NULL
  );

-- Zeige Erfolg
SELECT 'ENUMs zu TEXT konvertiert! ✅' as status;
