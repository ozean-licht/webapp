# 🧪 Test-Bestellung Tracking

## VOR der Bestellung

**Status Check durchführen:**
```bash
node scripts/check-orders-transactions-relationship.js
```

Notiere:
- Anzahl Transactions: ________
- Anzahl Orders: ________
- Neueste Transaction: ________
- Neueste Order: ________

---

## Test-Bestellung durchführen

**In Ablefy:**
1. Gehe zu einem Test-Produkt/Kurs
2. Kaufe mit deiner Test-Email: ____________________
3. Produkt gekauft: ____________________
4. Product ID: ____________________
5. Uhrzeit: ____________________

---

## NACH der Bestellung (warte 2-3 Minuten)

### 1. Check Airtable

**Prüfe ablefy_transactions Tabelle:**
```
- Neue Transaction vorhanden? [ ] JA / [ ] NEIN
- TRX ID: ________________
- Order Number: ________________
- Status: ________________
```

**Prüfe ablefy_orders Tabelle:**
```
- Neue Order vorhanden? [ ] JA / [ ] NEIN
- Order Number: ________________
- Product ID: ________________
- Buyer Email: ________________
```

### 2. Check N8N (wenn Webhook aktiv)

**N8N Execution:**
```
- Workflow ausgeführt? [ ] JA / [ ] NEIN
- Status: [ ] SUCCESS / [ ] ERROR
- Error Message (wenn vorhanden): ________________
```

### 3. Check Supabase

**Run SQL in Supabase SQL Editor:**

```sql
-- Check Transaction
SELECT 
  trx_id,
  order_number,
  transaction_date,
  buyer_email,
  bezahlt,
  status,
  product_id,
  produkt,
  order_id
FROM transactions 
WHERE buyer_email = 'DEINE_TEST_EMAIL'
ORDER BY transaction_date DESC 
LIMIT 1;
```

**Ergebnis:**
```
- Transaction in Supabase? [ ] JA / [ ] NEIN
- TRX ID: ________________
- order_id (FK) gesetzt? [ ] JA / [ ] NEIN
```

```sql
-- Check Order
SELECT 
  id,
  ablefy_order_number,
  buyer_email,
  ablefy_product_id,
  course_id,
  status,
  amount_gross,
  created_at
FROM orders 
WHERE buyer_email = 'DEINE_TEST_EMAIL'
ORDER BY created_at DESC 
LIMIT 1;
```

**Ergebnis:**
```
- Order in Supabase? [ ] JA / [ ] NEIN
- Order Number: ________________
- course_id gesetzt? [ ] JA / [ ] NEIN
- Status: ________________
```

```sql
-- Check Course Access
SELECT 
  c.id,
  c.title,
  c.slug,
  o.ablefy_order_number,
  o.status as order_status
FROM courses c
INNER JOIN orders o ON o.course_id = c.id
WHERE o.buyer_email = 'DEINE_TEST_EMAIL'
ORDER BY o.created_at DESC
LIMIT 1;
```

**Ergebnis:**
```
- Course Access vorhanden? [ ] JA / [ ] NEIN
- Course Title: ________________
- Slug: ________________
```

### 4. Test User Login (wenn User Account existiert)

```sql
-- Get User ID
SELECT id, email FROM auth.users WHERE email = 'DEINE_TEST_EMAIL';
```

**User ID:** ________________

```sql
-- Check get_user_course_access Function
SELECT * FROM get_user_course_access('USER_ID_HIER');
```

**Ergebnis:**
```
- Funktion gibt Kurs zurück? [ ] JA / [ ] NEIN
- Anzahl Kurse: ________
```

---

## 🔍 TROUBLESHOOTING

### Wenn Transaction NICHT in Supabase:
- [ ] Check Airtable Webhook konfiguriert?
- [ ] Check N8N Workflow aktiv?
- [ ] Check Edge Function deployed?
- [ ] Manuell importieren: `node scripts/import-missing-october-transactions.js`

### Wenn Order NICHT in Supabase:
- [ ] Prüfe ob Order in Airtable ist
- [ ] Manuell importieren: `node scripts/import-missing-orders.js`

### Wenn order_id (FK) NICHT gesetzt:
```sql
UPDATE transactions t
SET order_id = o.id
FROM orders o
WHERE t.order_number = o.ablefy_order_number
AND t.order_id IS NULL
AND t.buyer_email = 'DEINE_TEST_EMAIL';
```

### Wenn course_id NICHT gesetzt:
```sql
UPDATE orders o
SET course_id = cm.course_id
FROM course_mapping cm
WHERE o.ablefy_product_id = cm.ablefy_product_id::text
AND o.course_id IS NULL
AND o.buyer_email = 'DEINE_TEST_EMAIL';
```

---

## ✅ SUCCESS CRITERIA

Alle müssen JA sein:
- [ ] Transaction in Airtable
- [ ] Order in Airtable
- [ ] Transaction in Supabase
- [ ] Order in Supabase
- [ ] transaction.order_id gesetzt (FK Link)
- [ ] order.course_id gesetzt (Course Access)
- [ ] Course Access Query zeigt Kurs

---

## 📝 NOTIZEN

Weitere Beobachtungen:
_______________________________________________
_______________________________________________
_______________________________________________

---

**Datum:** ________________
**Uhrzeit:** ________________
**Tester:** ________________
**Ergebnis:** [ ] ✅ ERFOLGREICH / [ ] ❌ FEHLGESCHLAGEN
