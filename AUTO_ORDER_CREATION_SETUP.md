# 🤖 Automatische Order-Erstellung Setup

**Ziel:** Orders werden automatisch aus Transactions erstellt - für Ablefy UND Stripe!

---

## 🚀 SCHNELL-SETUP (Empfohlen)

### Option 1: Database Trigger (EINFACHSTE LÖSUNG)

**Vorteil:** Funktioniert komplett in der Datenbank, keine Edge Function nötig!

**Setup:**
```bash
# 1. SQL in Supabase SQL Editor ausführen
cat sql/setup-auto-order-creation.sql
```

Dann in **Supabase Dashboard → SQL Editor** den kompletten SQL-Code einfügen und ausführen.

**Das war's!** 🎉 Ab jetzt wird bei jeder neuen Transaction automatisch eine Order erstellt!

---

## ✅ VERIFICATION

Nach dem Setup teste ob es funktioniert:

**1. Mache eine Test-Bestellung in Ablefy**

**2. Prüfe in Supabase:**

```sql
-- Sollte 0 sein (alle Transactions haben Orders)
SELECT COUNT(*) as transactions_without_orders
FROM transactions
WHERE order_number IS NOT NULL
  AND order_id IS NULL;

-- Zeige neueste Orders
SELECT 
  o.id,
  o.ablefy_order_number,
  o.buyer_email,
  o.course_id,
  o.status,
  o.created_at
FROM orders o
ORDER BY o.created_at DESC
LIMIT 5;
```

**3. Check ob Order automatisch erstellt wurde:**

Die neueste Order sollte genau die Transaction haben die du gerade gemacht hast!

---

## 🔧 WIE ES FUNKTIONIERT

### Database Trigger Flow:

```
Transaction INSERT in Supabase
        ↓
Database Trigger feuert
        ↓
auto_create_order_from_transaction()
        ↓
1. Prüft ob Order existiert
2. Erstellt Order wenn nicht vorhanden ✅
3. Linkt Transaction → Order (order_id) ✅
4. Mappt Course ID (via course_mapping) ✅
5. Berechnet Order Totals ✅
6. Linkt zu User (falls vorhanden) ✅
```

### Was macht der Trigger?

**Für JEDE neue Transaction:**
1. ✅ Prüft ob `order_number` vorhanden
2. ✅ Prüft ob Order bereits existiert
3. ✅ Erstellt Order wenn nicht vorhanden
4. ✅ Setzt `order_id` in Transaction (Foreign Key)
5. ✅ Mappt `course_id` über `course_mapping`
6. ✅ Berechnet `amount_gross`, `fees_total` aus allen Transactions
7. ✅ Linkt zu `user_id` falls User existiert

**Funktioniert für:**
- ✅ Ablefy Transactions
- ✅ Stripe Transactions (wenn `order_number` gesetzt)
- ✅ Zahlungspläne (mehrere Transactions → 1 Order)

---

## 🧪 TEST MIT DUMMY DATA

Wenn du ohne echte Bestellung testen willst:

```sql
-- 1. Insert Test Transaction
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
  999999997,
  99999997,
  'test@example.com',
  NOW(),
  'Erfolgreich',
  419336,
  'Test Product',
  99.00,
  'ablefy',
  'new'
);

-- 2. Check ob Order automatisch erstellt wurde
SELECT * FROM orders WHERE ablefy_order_number = 99999997;

-- Sollte 1 Order zeigen mit:
-- - buyer_email: test@example.com
-- - status: paid
-- - course_id: 1028 (wenn 419336 gemappt ist)

-- 3. Check ob Transaction verlinkt ist
SELECT 
  t.trx_id,
  t.order_number,
  t.order_id,
  o.id as order_table_id
FROM transactions t
LEFT JOIN orders o ON o.ablefy_order_number = t.order_number
WHERE t.trx_id = 999999997;

-- order_id sollte NICHT NULL sein!

-- 4. Cleanup
DELETE FROM transactions WHERE trx_id = 999999997;
DELETE FROM orders WHERE ablefy_order_number = 99999997;
```

---

## 🐛 TROUBLESHOOTING

### Transaction hat keine Order bekommen?

**Check 1: Hat Transaction ein order_number?**
```sql
SELECT trx_id, order_number, buyer_email
FROM transactions
WHERE order_id IS NULL
  AND created_at > NOW() - INTERVAL '10 minutes'
ORDER BY created_at DESC;
```

Wenn `order_number` NULL ist → Transaction kann keine Order erstellen!

**Check 2: Ist Trigger aktiv?**
```sql
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trg_auto_create_order';
```

Sollte 1 Zeile zeigen. Wenn nicht → SQL nochmal ausführen!

**Check 3: Error Logs prüfen**

Im Supabase Dashboard → Logs → Database Logs
Suche nach: "auto_create_order"

### Order wurde erstellt aber course_id ist NULL?

**Produkt nicht in course_mapping:**
```sql
-- Check ob Product ID in course_mapping ist
SELECT * FROM course_mapping
WHERE ablefy_product_id = 'DEINE_PRODUCT_ID'
  AND is_active = true;
```

Wenn nicht vorhanden:
1. Produkt zu `courses` Tabelle hinzufügen mit `ablefy_product_id`
2. `node scripts/sync-course-mapping-from-courses.js` ausführen

---

## 📊 MONITORING

**Dashboard Query - Füge zu Supabase Favorites hinzu:**

```sql
-- Transactions in letzter Stunde
SELECT 
  COUNT(*) FILTER (WHERE order_id IS NOT NULL) as with_order,
  COUNT(*) FILTER (WHERE order_id IS NULL AND order_number IS NOT NULL) as without_order,
  COUNT(*) as total
FROM transactions
WHERE created_at > NOW() - INTERVAL '1 hour';

-- Sollte ohne_order = 0 sein!

-- Neueste Auto-Created Orders
SELECT 
  o.ablefy_order_number,
  o.buyer_email,
  o.course_id,
  o.status,
  o.amount_gross,
  o.created_at,
  COUNT(t.id) as transaction_count
FROM orders o
LEFT JOIN transactions t ON t.order_id = o.id
WHERE o.created_at > NOW() - INTERVAL '24 hours'
  AND o.imported_from_ablefy = false
GROUP BY o.id
ORDER BY o.created_at DESC
LIMIT 10;
```

---

## 🎯 VORTEILE

**Automatisch:**
- ✅ Keine manuellen Scripts mehr
- ✅ Funktioniert für Ablefy UND Stripe
- ✅ Echtzeit (sofort bei Transaction INSERT)
- ✅ Atomic (alles in einer Transaktion)

**Zuverlässig:**
- ✅ Keine Race Conditions
- ✅ Keine Duplikate
- ✅ Rollback bei Fehler

**Wartbar:**
- ✅ Logik in Datenbank (nicht in Edge Function)
- ✅ Einfach zu debuggen (SQL Logs)
- ✅ Einfach zu testen (SQL Insert)

---

## 🚀 NEXT STEPS

Nach dem Setup:

1. ✅ **Test-Bestellung machen**
2. ✅ **Prüfen ob Order automatisch erstellt wurde**
3. ✅ **`./fix-orders.sh` löschen** (nicht mehr nötig!)
4. ✅ **Genießen** - Orders werden jetzt automatisch erstellt! 🎉

---

**Setup-Datum:** _________________  
**Getestet:** [ ] JA / [ ] NEIN  
**Funktioniert:** [ ] ✅ / [ ] ❌
