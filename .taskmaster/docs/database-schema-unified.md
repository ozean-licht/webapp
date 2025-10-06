# Unified Database Schema - Transactions & Orders
**Architecture:** Ablefy + Stripe = ONE unified table approach  
**Date:** 06. Oktober 2025  

---

## 🏗️ Schema Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   UNIFIED ARCHITECTURE                       │
│              Ablefy (Legacy) + Stripe (New)                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│     ORDERS       │◄─────│  TRANSACTIONS    │      │  COURSE_MAPPING  │
│  (Unified)       │ 1:N  │   (Unified)      │      │                  │
├──────────────────┤      ├──────────────────┤      ├──────────────────┤
│ id (UUID) PK     │      │ id (UUID) PK     │      │ id (UUID) PK     │
│ ablefy_order_num │      │ trx_id (Ablefy)  │      │ ablefy_product_id│
│ stripe_intent_id │      │ stripe_intent_id │      │ course_id (FK)   │
│ order_number ✨  │      │ order_id (FK) ───┼─────►│ course_title     │
│ source 🔀        │      │ source_platform  │      │ is_active        │
│ account_type     │      │ account_type     │      └──────────────────┘
│ buyer_email      │      │ buyer_email      │               │
│ course_id (FK) ──┼──────┼──────────────────┼───────────────┘
│ user_id (FK)     │      │ user_id (FK)     │      Maps product_id
│ status           │      │ status           │      to course_id
│ amount_gross     │      │ bezahlt          │
│ transactions_cnt │      │ fees_total       │
└──────────────────┘      │ payment_method   │
         │                │ transaction_date │
         │                └──────────────────┘
         │                         │
         │                         │
         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│     COURSES      │      │   AUTH.USERS     │
│                  │      │                  │
├──────────────────┤      ├──────────────────┤
│ id (UUID) PK     │      │ id (UUID) PK     │
│ title            │      │ email            │
│ slug             │      │ ...              │
│ price            │      └──────────────────┘
│ ...              │               │
└──────────────────┘               │
         │                         │
         │                         │
         ▼                         ▼
┌────────────────────────────────────┐
│        USER_COURSES                │
│    (Access Derived from Orders)    │
├────────────────────────────────────┤
│ user_id (FK)                       │
│ course_id (FK)                     │
│ enrolled_at (from order_date)      │
│ source ('ablefy' or 'stripe')      │
└────────────────────────────────────┘
```

---

## 🔀 Source Distinction

### Field: `source` / `source_platform`
```typescript
type Source = 'ablefy' | 'stripe' | 'manual'
```

**Ablefy Transactions:**
```sql
source_platform = 'ablefy'
trx_id IS NOT NULL
stripe_payment_intent_id IS NULL
```

**Stripe Transactions:**
```sql
source_platform = 'stripe'
stripe_payment_intent_id IS NOT NULL
trx_id IS NULL
```

---

## 🔑 Generated Order Numbers

**Auto-generated per source:**

```sql
order_number = CASE 
  WHEN ablefy_order_number IS NOT NULL 
    THEN 'ABL-' || ablefy_order_number  -- e.g., "ABL-12863195"
  WHEN stripe_payment_intent_id IS NOT NULL 
    THEN 'STR-' || stripe_payment_intent_id  -- e.g., "STR-pi_xxxxx"
  ELSE 'ORD-' || id  -- Fallback
END
```

**Benefits:**
- ✅ Human-readable
- ✅ Source-identifiable at a glance
- ✅ Unique across both systems
- ✅ Sortable

---

## 📥 Import Process

### Step 1: Populate course_mapping
```sql
-- From Airtable course_mapping table
INSERT INTO course_mapping (ablefy_product_id, course_id, course_title)
SELECT 
  ablefy_product_id,
  (SELECT id FROM courses WHERE course_code = xxx), -- Map via course_code
  course_title
FROM airtable_course_mapping;
```

### Step 2: Import Orders
```sql
-- From Airtable ablefy_orders
INSERT INTO orders (
  ablefy_order_number,
  source,
  account_type,
  buyer_email,
  buyer_first_name,
  buyer_last_name,
  order_date,
  status,
  ablefy_product_id,
  course_id, -- Map via course_mapping
  amount_net,
  initial_amount,
  imported_from_ablefy,
  imported_at
) SELECT ...
```

### Step 3: Import Transactions
```sql
-- From Airtable ablefy_transactions
INSERT INTO transactions (
  trx_id,
  rechnungsnummer,
  transaction_date,
  status,
  typ,
  zahlungsart,
  order_id, -- Link via order_number lookup
  product_id,
  course_id, -- Map via course_mapping
  bezahlt,
  fees_total,
  buyer_email,
  ...
  source_platform,
  account_type,
  imported_from_ablefy,
  imported_at
) SELECT ...
```

---

## 🔒 Row Level Security

### Transactions RLS
```sql
-- Users see own transactions
user_id = auth.uid()

-- Admins see all
role = 'admin'
```

### Orders RLS
```sql
-- Users see own orders
user_id = auth.uid()

-- Admins see all
role = 'admin'
```

### Course_mapping RLS
```sql
-- Everyone can READ (needed for access checks)
SELECT: true

-- Only admins can MODIFY
INSERT/UPDATE/DELETE: role = 'admin'
```

---

## 🎯 Access Derivation Functions

### Check Course Access
```sql
-- Function: user_has_course_access(user_id, course_id)
SELECT user_has_course_access(
  auth.uid(),
  'course-uuid-here'
) as has_access;

-- Returns: true/false
```

### Get All User Courses
```sql
-- Function: get_user_course_access(user_id)
SELECT * FROM get_user_course_access(auth.uid());

-- Returns: List of accessible courses with purchase info
```

### Create Access Entry
```sql
-- After successful payment (Ablefy OR Stripe)
INSERT INTO user_courses (user_id, course_id, enrolled_at, source)
SELECT 
  o.user_id,
  o.course_id,
  o.order_date,
  o.source
FROM orders o
WHERE o.id = $1
AND o.status = 'paid'
AND o.course_id IS NOT NULL;
```

---

## 🔄 Stripe Integration (Future)

### Webhook Events to Handle

**payment_intent.succeeded:**
```javascript
// N8N Workflow
1. Parse Stripe webhook
2. Create order:
   {
     stripe_payment_intent_id: event.data.object.id,
     source: 'stripe',
     account_type: 'new',
     buyer_email: event.data.object.metadata.email,
     course_id: event.data.object.metadata.course_id,
     amount_gross: event.data.object.amount / 100,
     status: 'paid'
   }
3. Create transaction:
   {
     stripe_payment_intent_id: event.data.object.id,
     source_platform: 'stripe',
     order_id: created_order.id,
     bezahlt: amount,
     status: 'Erfolgreich'
   }
4. Grant course access (user_courses)
5. Send email (Resend)
```

---

## 📊 Analytics Views

### View: Monthly Revenue (All Sources)
```sql
CREATE VIEW monthly_revenue AS
SELECT 
  DATE_TRUNC('month', transaction_date) as month,
  source_platform,
  COUNT(*) as count,
  SUM(bezahlt) as gross,
  SUM(bezahlt_minus_fee) as net,
  SUM(fees_total) as fees
FROM transactions
WHERE status = 'Erfolgreich'
GROUP BY month, source_platform
ORDER BY month DESC;
```

### View: Active Enrollments (All Sources)
```sql
CREATE VIEW active_enrollments AS
SELECT 
  user_id,
  buyer_email,
  course_id,
  course_title,
  source, -- 'ablefy' or 'stripe'
  order_date,
  amount_gross
FROM orders
WHERE status = 'paid'
AND course_id IS NOT NULL;
```

---

## ✅ Advantages of Unified Approach

1. **Single Source of Truth** - One place for all transaction data
2. **Simpler Queries** - No UNION needed between ablefy/stripe
3. **Consistent RLS** - Same policies for all sources
4. **Future-Proof** - Easy to add more payment providers
5. **Analytics** - Unified reporting across all sources
6. **Maintenance** - One schema to maintain

---

## 🚫 What We DON'T Have

- ❌ NO `ablefy_transactions` table (unified in `transactions`)
- ❌ NO `ablefy_orders` table (unified in `orders`)
- ❌ NO `stripe_transactions` table (unified in `transactions`)
- ❌ NO `stripe_orders` table (unified in `orders`)

**Instead:**
- ✅ ONE `transactions` table (all sources)
- ✅ ONE `orders` table (all sources)
- ✅ ONE `course_mapping` table (for migration)

---

**Architecture:** Unified & Elegant ✨  
**Maintainability:** High 🎯  
**Scalability:** Easy to add more payment providers 🚀
