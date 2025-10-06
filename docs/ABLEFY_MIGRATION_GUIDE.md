# Ablefy Migration Guide

## Übersicht

Diese Anleitung führt durch die Migration der Ablefy-Transaktionen nach Supabase und die Einrichtung der Echtzeit-Synchronisation für den 3-monatigen Parallelbetrieb.

## Voraussetzungen

- [ ] Airtable API Key in `.env.local`
- [ ] Supabase Projekt mit Service Key
- [ ] N8N Instance für Workflows
- [ ] Node.js für Import-Script

## 1. Datenbank-Setup

### Migrations ausführen

```bash
# Basis-Tabellen (bereits vorhanden)
supabase migration up

# Import-Funktionen hinzufügen
supabase db push
```

Die Migrations erstellen:
- `transactions` Tabelle (unified für Ablefy + Stripe)
- `orders` Tabelle (unified)
- `course_mapping` Tabelle
- Helper Functions für Import

## 2. Course Mapping

Das Course Mapping verbindet Ablefy `product_id` mit unseren `course_id`:

### Wichtige Mappings (Beispiele aus Airtable)
```
product_id | course_id | course_title
-----------|-----------|-------------
419336     | 1019      | Sterben für Anfänger
443030     | 1053      | Earth Code
420632     | 1020      | Workshop UFO Sichtungen
```

Das Mapping wird automatisch beim Import aus Airtable gefüllt.

## 3. Import Script

### Preview Mode
```bash
cd /Users/serg/Desktop/ozean-licht
node scripts/import-ablefy-transactions.js preview
```

Zeigt:
- 40.893 Transaktionen
- 38.474 Orders
- 65 Course Mappings
- €2.1M Gesamtumsatz

### Import Mode
```bash
# Nur wenn Preview OK aussieht!
node scripts/import-ablefy-transactions.js import
```

Schritte:
1. Course Mappings importieren
2. Orders importieren
3. Transactions importieren
4. Verknüpfungen herstellen

### Validate Mode
```bash
node scripts/import-ablefy-transactions.js validate
```

Überprüft:
- Record Counts
- Financial Totals
- Verknüpfungen

## 4. Post-Import Cleanup

Nach dem Import in Supabase SQL Editor:

```sql
-- Finalize import (links all data)
SELECT * FROM finalize_ablefy_import();

-- Check statistics
SELECT * FROM import_statistics;

-- Find unmapped products
SELECT * FROM unmapped_products;
```

## 5. N8N Echtzeit-Sync Setup

### Edge Function deployen
```bash
supabase functions deploy process-ablefy-webhook
```

### Environment Variables setzen
In Supabase Dashboard > Edge Functions > Secrets:
```
N8N_WEBHOOK_SECRET=your-secure-webhook-secret
```

### N8N Workflow importieren
1. In N8N: Import from File
2. Wähle: `workflows/ablefy-transaction-sync.json`
3. Konfiguriere:
   - Airtable Credentials
   - SMTP für Error Emails
   - Environment Variables:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `N8N_WEBHOOK_SECRET`

### Ablefy Webhook konfigurieren
In Ablefy/Airtable Webhook auf N8N Webhook URL zeigen:
```
https://your-n8n-instance.com/webhook/ablefy-transaction-webhook
```

## 6. Monitoring

### Transaktions-Status
```sql
-- Erfolgreiche Transaktionen heute
SELECT COUNT(*), SUM(bezahlt) as total
FROM transactions 
WHERE DATE(transaction_date) = CURRENT_DATE
AND status = 'Erfolgreich'
AND source_platform = 'ablefy';

-- Fehlgeschlagene Sync
SELECT * FROM transactions
WHERE imported_from_ablefy = true
AND order_id IS NULL
AND order_number IS NOT NULL;
```

### Dashboard Views
- `successful_transactions_with_courses`
- `monthly_revenue`
- `user_purchase_history`
- `active_course_enrollments`

## 7. Wichtige Hinweise

### Status Normalisierung
Das System normalisiert automatisch:
- `successful` → `Erfolgreich`
- `pending` → `Ausstehend`
- etc.

### Payment Methods
Werden ebenfalls normalisiert:
- `paypal` → `PayPal`
- `card` → `Kreditkarte`
- etc.

### Account Types
- `old`: Legacy Ablefy Account
- `new`: Aktueller Ablefy Account

### Product ID Mapping
**WICHTIG**: Die Ablefy `product_id` ist der Schlüssel für:
- Course Zuordnung
- Access Control
- N8N Webhooks

Neue Kurse müssen in `course_mapping` eingetragen werden!

## 8. Troubleshooting

### Import schlägt fehl
```bash
# Check logs
tail -f /tmp/import.log

# Retry mit spezifischem Offset
node scripts/import-ablefy-transactions.js import --offset=1000
```

### N8N Webhook Errors
- Check Edge Function Logs in Supabase
- Verify webhook secret matches
- Check Airtable permissions

### Fehlende Course Mappings
```sql
-- Find unmapped products
SELECT DISTINCT product_id, produkt, COUNT(*)
FROM transactions
WHERE course_id IS NULL
AND product_id IS NOT NULL
GROUP BY product_id, produkt
ORDER BY COUNT(*) DESC;

-- Add mapping
INSERT INTO course_mapping (ablefy_product_id, course_id, course_title)
VALUES (12345, 'uuid-here', 'Course Title');
```

## 9. Daily Reconciliation

Für zusätzliche Sicherheit kann ein täglicher Abgleich eingerichtet werden:

1. N8N Schedule Workflow (3 Uhr nachts)
2. Fetch letzte 24h aus Airtable
3. Compare mit Supabase
4. Sync fehlende Transaktionen
5. Email Report

## 10. Nächste Schritte

Nach erfolgreicher Migration:

1. [ ] User Accounts verknüpfen (basierend auf Email)
2. [ ] Course Access ableiten
3. [ ] Email Notifications einrichten
4. [ ] Stripe Integration parallel aufbauen
5. [ ] Nach 3 Monaten: Ablefy abschalten

## Support

Bei Fragen oder Problemen:
- Edge Function Logs: Supabase Dashboard
- N8N Executions: N8N Dashboard
- Database Queries: Supabase SQL Editor
