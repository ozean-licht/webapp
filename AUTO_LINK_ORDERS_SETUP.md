# 🔗 Automatisches Order-Linking Setup

## Problem

Wenn User sich neu registrieren/einloggen, sind ihre vorhandenen Orders (von Ablefy) nicht automatisch mit ihrem Account verknüpft, weil:
- Orders existieren **vor** der User-Registrierung
- `orders.buyer_email` stimmt mit `auth.users.email` überein
- Aber `orders.user_id` ist `NULL`

## Lösung: Automatisches Linking

Wir haben einen **hybriden Ansatz** implementiert:

### 1. Database Trigger (Empfohlen ✅)

**Wie es funktioniert:**
- Automatischer Trigger auf `auth.users` INSERT
- Verknüpft **sofort** alle Orders mit matching Email
- Läuft direkt in der Datenbank (schnell & zuverlässig)

**Installation:**

```sql
-- In Supabase SQL Editor ausführen:
-- File: /sql/setup-auto-link-trigger.sql
```

Das Script macht:
1. ✅ Erstellt Trigger-Function `auto_link_user_orders()`
2. ✅ Erstellt Trigger auf `auth.users` INSERT
3. ✅ Backfill für existierende Users
4. ✅ Verifikation der Results

**Vorteile:**
- ⚡ Super schnell (direkt in DB)
- 🔒 Sicher (läuft mit SECURITY DEFINER)
- 🎯 Zuverlässig (kann nicht fehlschlagen/vergessen werden)
- 🔄 Automatisch für alle zukünftigen Users

### 2. Edge Function Alternative (Optional)

**Wann nutzen:**
- Wenn du zusätzliche Logic brauchst (z.B. Welcome Email)
- Wenn du Notifications senden willst
- Wenn du externe Services callen musst

**Installation:**

```bash
# Deploy Edge Function
supabase functions deploy auto-link-orders-on-login

# Setup Webhook in Supabase Dashboard:
# Database > Webhooks > Create Webhook
# Table: auth.users
# Events: INSERT
# URL: https://YOUR_PROJECT.supabase.co/functions/v1/auto-link-orders-on-login
```

## Setup-Schritte

### Step 1: Database Trigger installieren

```bash
# In Supabase SQL Editor:
1. Öffne: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
2. Kopiere Inhalt von: /sql/setup-auto-link-trigger.sql
3. Klicke "Run"
4. Verifiziere Output
```

### Step 2: Bestehende Users linken (Backfill)

```sql
-- Wird automatisch im Setup-Script ausgeführt
-- Oder manuell für spezifische User:

UPDATE orders o
SET user_id = (SELECT id FROM auth.users WHERE LOWER(email) = LOWER(o.buyer_email))
WHERE o.user_id IS NULL
AND EXISTS (SELECT 1 FROM auth.users WHERE LOWER(email) = LOWER(o.buyer_email));
```

### Step 3: Testen

```bash
# Test 1: Neue Registrierung
1. Registriere dich mit einer Email die Orders hat
2. Login
3. Gehe zu /bibliothek
4. Kurse sollten sofort da sein ✅

# Test 2: SQL Verification
SELECT 
    u.email,
    COUNT(o.id) as orders
FROM auth.users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.email;
```

## Wie es funktioniert

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REGISTRIERUNG                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ auth.users       │
                    │ INSERT           │
                    │ email: user@x.de │
                    └──────────────────┘
                              │
                              ▼ TRIGGER FIRES
                    ┌──────────────────┐
                    │ auto_link_       │
                    │ user_orders()    │
                    └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
          ┌──────────────────┐  ┌──────────────────┐
          │ UPDATE orders    │  │ UPDATE trans.    │
          │ SET user_id      │  │ SET user_id      │
          │ WHERE email =    │  │ WHERE email =    │
          └──────────────────┘  └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ ✅ Orders linked │
                    │ User sees courses│
                    └──────────────────┘
```

## Monitoring

```sql
-- Check trigger status
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'trigger_auto_link_user_orders';

-- Check linking success rate
SELECT 
    COUNT(*) FILTER (WHERE user_id IS NOT NULL) as linked,
    COUNT(*) FILTER (WHERE user_id IS NULL) as unlinked,
    ROUND(100.0 * COUNT(*) FILTER (WHERE user_id IS NOT NULL) / COUNT(*), 2) as success_rate
FROM orders;

-- Find unlinked orders
SELECT 
    buyer_email,
    COUNT(*) as order_count,
    EXISTS(SELECT 1 FROM auth.users WHERE LOWER(email) = LOWER(buyer_email)) as user_exists
FROM orders
WHERE user_id IS NULL
GROUP BY buyer_email
ORDER BY order_count DESC;
```

## Troubleshooting

### Problem: Orders nicht verknüpft

**Check 1: Email-Match**
```sql
-- Sind die Emails exakt gleich?
SELECT 
    o.buyer_email as order_email,
    u.email as user_email,
    LOWER(o.buyer_email) = LOWER(u.email) as match
FROM orders o
CROSS JOIN auth.users u
WHERE o.buyer_email ILIKE '%DEINE_EMAIL%';
```

**Check 2: Trigger aktiv?**
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'trigger_auto_link_user_orders';
```

**Check 3: Trigger-Log**
```sql
-- Check PostgreSQL logs in Supabase Dashboard
-- Database > Logs
-- Look for: "Auto-linked X orders"
```

### Problem: Doppelte Email-Varianten

```sql
-- Finde Email-Varianten (spaces, case, etc.)
SELECT 
    DISTINCT buyer_email,
    COUNT(*) as order_count
FROM orders
GROUP BY buyer_email
ORDER BY order_count DESC;
```

## Performance

- ⚡ **Database Trigger**: ~10ms pro User
- 🔄 **Batch Linking**: ~100-500ms für 1000 Orders
- 💾 **Memory**: Minimal (single UPDATE query)

## Security

- 🔒 Function läuft mit `SECURITY DEFINER`
- ✅ Nur Email-Matching (keine User-Input)
- 🛡️ RLS Policies bleiben aktiv
- 📝 Audit-Trail via Database Logs

## Alternative: Manual Linking

Falls automatisches Linking nicht gewünscht:

```sql
-- Link spezifischen User
UPDATE orders 
SET user_id = 'USER_UUID_HERE'
WHERE LOWER(buyer_email) = 'user@example.com'
AND user_id IS NULL;
```

## Nächste Schritte

1. ✅ Setup Database Trigger (empfohlen)
2. ✅ Backfill existierende Users
3. 🔔 Optional: Welcome Email mit Kursliste
4. 📊 Optional: Analytics für Link-Rate
5. 🧪 Testing mit echten Users

