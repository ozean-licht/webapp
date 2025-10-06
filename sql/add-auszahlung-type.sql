-- Add "Auszahlung" to transaction_type ENUM
ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS 'Auszahlung';
