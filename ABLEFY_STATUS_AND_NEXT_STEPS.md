# ✅ Ablefy Import - Status & Next Steps

## 📊 AKTUELLER STATUS

### Importierte Daten ✅
- **39.094 Transactions** (€2.1M)
- **38.475 Orders**
- **64 Course Mappings** aktiv
- **30.782 Transactions** mit Course (78.7%)
- **30.219 Orders** mit Course (78.5%)

### Kritische Issues ⚠️

#### 1. User Linking (ERWARTET)
- **Transactions**: 12 mit User-ID
- **Orders**: 0 mit User-ID ← **PROBLEM!**
- **Grund**: Nur 1-2 Users in auth.users existieren
- **Fix**: SQL ausführen: `sql/fix-order-user-linking.sql`

#### 2. Legacy Kurse (OK)
- ~8k Transaktionen ohne Course-Mapping
- **Grund**: Alte Kurse aus Ablefy nicht mehr aktiv
- **Status**: OK für Accounting

#### 3. "Auszahlung" Typ fehlt
- Einige Batches haben `typ: "Auszahlung"` 
- Nicht im ENUM `transaction_type`
- **Fix**: Entweder ignorieren oder ENUM erweitern

## 🚀 NÄCHSTE SCHRITTE

### 1. Order User-Linking fixen (JETZT)
```sql
-- Führe aus: sql/fix-order-user-linking.sql
-- (Passe deine Email an!)
```

### 2. Ablefy → Supabase Direkt-Sync

#### Option A: N8N Webhook (EMPFOHLEN)
```
Ablefy Webhook → N8N → Supabase Edge Function
```

**Setup:**
- N8N Workflow: `workflows/ablefy-transaction-sync.json`
- Edge Function: `process-ablefy-webhook` (bereits deployed)
- Webhook URL: `https://suwevnhwtmcazjugfmps.supabase.co/functions/v1/process-ablefy-webhook`

**Konfiguration in N8N:**
1. Import Workflow JSON
2. Set Credentials (Airtable API Key)
3. Set Environment:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `N8N_WEBHOOK_SECRET`
4. Aktivieren

#### Option B: Airtable Automation
```
Airtable Automation → Webhook → Supabase Edge Function
```

In Airtable:
- Trigger: "When record created/updated" in ablefy_transactions
- Action: "Send webhook"
- URL: Supabase Edge Function
- Headers: Authorization + x-webhook-secret

### 3. Test-Bestellung Flow

#### A. Ablefy Test-Kauf
- Kurs in Ablefy kaufen
- Webhook wird gefeuert
- N8N verarbeitet
- Supabase erhält Transaktion

#### B. Access Check in Supabase
```sql
-- Check ob Order erstellt wurde
SELECT * FROM orders 
WHERE buyer_email = 'DEINE_TEST_EMAIL'
ORDER BY created_at DESC LIMIT 1;

-- Check ob course_id gemappt wurde
SELECT 
    o.ablefy_order_number,
    o.course_id,
    c.title
FROM orders o
LEFT JOIN courses c ON c.id = o.course_id
WHERE o.buyer_email = 'DEINE_TEST_EMAIL'
ORDER BY o.created_at DESC;
```

#### C. Localhost Course Access
Dashboard zeigt Kurse basierend auf:
```sql
SELECT * FROM get_user_course_access(auth.uid());
```

### 4. /bibliothek Seite erstellen

**Anforderungen:**
- Zeigt alle Kurse mit `user_has_course_access()`
- Basierend auf `orders` Tabelle (status = 'paid')
- Responsive Grid mit Course Cards
- Link zu /courses/[slug]/learn

**Layout:**
```
/bibliothek
├─ Header: "Meine Kurse"
├─ Filter: Alle / In Bearbeitung / Abgeschlossen
├─ Course Grid:
│  ├─ Course Card (Thumbnail, Title, Progress)
│  └─ "Weiter lernen" Button → /courses/[slug]/learn
└─ Empty State: "Noch keine Kurse"
```

## 🔧 SQL FIXES

### Fix "Auszahlung" Type Error
```sql
ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS 'Auszahlung';
```

### Fix Order User Linking
```sql
-- sql/fix-order-user-linking.sql
UPDATE orders o
SET user_id = u.id
FROM auth.users u
WHERE LOWER(o.buyer_email) = LOWER(u.email)
AND o.user_id IS NULL;
```

## ✅ MIGRATION CHECKLIST

- [x] Import 40k Transactions ✅
- [x] Import 38k Orders ✅
- [x] Course Mapping (64) ✅
- [x] Transaction → Order Links ✅
- [x] Course IDs gemappt (78%) ✅
- [ ] Order → User Links (fix pending)
- [ ] Edge Function getestet
- [ ] N8N Workflow konfiguriert
- [ ] Test-Bestellung durchgeführt
- [ ] /bibliothek Seite erstellt

## 🎯 KRITISCHE ISSUES ZUSAMMENFASSUNG

### ❌ MUSS GEFIXT WERDEN:
1. **Order User-Linking**: 0 statt 12+ Orders mit user_id
   - **Fix**: `sql/fix-order-user-linking.sql` ausführen

### ⚠️ ERWARTETE ISSUES (OK):
2. **User-Accounts**: Nur 1-2 Users in auth.users
   - 9.738 Käufer haben noch keine Accounts
   - Später: Bulk-User-Erstellung + Magic Links

3. **Legacy Courses**: 8k unmapped Transaktionen
   - Alte gelöschte Kurse
   - Behalten für Accounting

4. **"Auszahlung" Typ**: Fehlt im ENUM
   - Auszahlungen an Ablefy (nicht Zahlungen)
   - Optional: ENUM erweitern

### ✅ ALLES GUT:
- 99%+ Transactions → Orders linked
- 78% Course Mappings (64 aktive Kurse)
- Financial Totals korrekt
- Status normalisiert

## 🚀 READY FOR:
1. Fix Order User-Linking (5 Min)
2. Test Edge Function (2 Min)
3. N8N Automation (deine GUI Config)
4. Test-Bestellung (10 Min)
5. /bibliothek Seite (30 Min)
