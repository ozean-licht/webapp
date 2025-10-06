# Ablefy → Supabase Direkt-Webhook Setup

## Flow
```
Ablefy/Elopage
    ↓ (Webhook bei neuer Transaktion)
Supabase Edge Function (process-ablefy-webhook)
    ↓ (Nach erfolgreicher Verarbeitung)
Airtable (Backup via N8N/Automation)
```

## 1. Ablefy Webhook Konfiguration

### In Ablefy/Elopage Admin:
1. **Settings** → **Webhooks** → **Add Webhook**

2. **Webhook URL:**
```
https://suwevnhwtmcazjugfmps.supabase.co/functions/v1/process-ablefy-webhook
```

3. **Events auswählen:**
- ✅ `payment.successful`
- ✅ `payment.pending`
- ✅ `payment.failed`
- ✅ `payment.refunded`

4. **Headers:**
```
Authorization: Bearer [DEIN_SUPABASE_ANON_KEY aus .env.local]
x-webhook-secret: [DEIN_N8N_WEBHOOK_SECRET aus .env.local]
Content-Type: application/json
```

5. **Payload Format:** JSON mit allen Feldern

### Beispiel Payload:
```json
{
  "trx_id": 919815274,
  "order_number": 12863195,
  "product_id": 419336,
  "email": "kunde@example.com",
  "vorname": "Max",
  "nachname": "Mustermann",
  "status": "successful",
  "typ": "Zahlungseingang",
  "zahlungsart": "PayPal",
  "bezahlt": 34.32,
  "datum": "08.03.2025 10:41",
  "account_type": "new"
  // ... alle anderen Felder
}
```

## 2. Edge Function (bereits deployed)

**Status:** ✅ Deployed und bereit

**Features:**
- Normalisiert Status (`successful` → `Erfolgreich`)
- Normalisiert Zahlungsmethoden
- Erstellt automatisch Order wenn nicht existiert
- Mappt Course via product_id
- Verknüpft User via Email (wenn vorhanden)
- Berechnet Order Totals

**Logs ansehen:**
```bash
npx supabase functions logs process-ablefy-webhook
```

## 3. Supabase → Airtable Backup Sync

### Option A: Database Webhook (EMPFOHLEN)

In Supabase SQL Editor:

```sql
-- Create webhook function
CREATE OR REPLACE FUNCTION notify_airtable_on_transaction()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT := 'https://your-n8n-or-make.com/webhook/backup-to-airtable';
BEGIN
  -- Send to N8N/Make/Zapier für Airtable Backup
  PERFORM net.http_post(
    url := webhook_url,
    body := jsonb_build_object(
      'transaction_id', NEW.id,
      'trx_id', NEW.trx_id,
      'order_number', NEW.order_number,
      'buyer_email', NEW.buyer_email,
      'bezahlt', NEW.bezahlt,
      'status', NEW.status,
      'product_id', NEW.product_id,
      'account_type', NEW.account_type
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
CREATE TRIGGER backup_to_airtable_after_insert
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION notify_airtable_on_transaction();
```

### Option B: N8N Scheduled Sync

**Workflow:**
1. Schedule: Every 5 minutes
2. Query Supabase für neue Transaktionen (last 5 min)
3. Update Airtable Records

## 4. Test-Flow

### A. Test mit Webhook-Tool
```bash
node scripts/test-ablefy-webhook.js
```

Sollte zeigen: `✅ Webhook erfolgreich getestet!`

### B. Test-Bestellung in Ablefy
1. Produkt kaufen (günstigster Kurs)
2. Check Supabase SQL Editor:
```sql
SELECT * FROM transactions 
WHERE buyer_email = 'DEINE_TEST_EMAIL'
ORDER BY created_at DESC LIMIT 1;

SELECT * FROM orders 
WHERE buyer_email = 'DEINE_TEST_EMAIL'
ORDER BY created_at DESC LIMIT 1;
```

### C. Access Check auf Localhost
1. Login mit Test-Account
2. Gehe zu: `http://localhost:3000/bibliothek`
3. Erwarte: Gekaufter Kurs wird angezeigt
4. Klick auf "Weiter lernen"
5. Erwarte: `/courses/{slug}/learn` öffnet sich

## 5. Airtable Tabellen löschen (SPÄTER)

**Erst wenn alles funktioniert!**

```
In Airtable:
1. Backup erstellen (CSV Export)
2. Tabelle löschen: ablefy_transactions
3. Tabelle löschen: ablefy_orders
```

**Oder umbenennen** zu: `_archived_ablefy_transactions`

## 6. Webhook-URL für Ablefy

```
URL: https://suwevnhwtmcazjugfmps.supabase.co/functions/v1/process-ablefy-webhook

Method: POST

Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [DEIN_ANON_KEY]
  x-webhook-secret: [DEIN_SECRET]
  Content-Type: application/json

Body: {
  // Alle Transaction-Felder von Ablefy
}
```

## ✅ Checklist

- [x] Edge Function deployed
- [x] Webhook Secret gesetzt
- [x] Course Mappings vorhanden (64)
- [x] Test-Script vorhanden
- [ ] Ablefy Webhook konfiguriert
- [ ] Test-Bestellung durchgeführt
- [ ] /bibliothek zeigt Kurse
- [ ] Supabase → Airtable Backup
- [ ] Alte Airtable Tabellen löschen
