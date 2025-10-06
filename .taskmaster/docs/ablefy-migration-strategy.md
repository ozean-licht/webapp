# Ablefy Migration Strategy
**Date:** 06. Oktober 2025  
**Status:** Schema Ready, Implementation Pending  

---

## 🎯 Migration Goals

1. **Zero Data Loss** - Alle Ablefy Transaktionen & Orders importieren
2. **Unified Architecture** - Ablefy UND Stripe in DENSELBEN Tabellen
3. **Access Derivation** - Legacy-Käufe automatisch zu Course Access mappen
4. **No Downtime** - Nahtloser Übergang von Ablefy → Stripe
5. **Parallel Operations** - Ablefy läuft weiter während Stripe aktiviert wird

---

## 📊 Unified Database Schema

### ✅ ONE `transactions` Table (NOT separate ablefy_transactions!)

**Stores:**
- ✅ Ablefy legacy transactions (via import)
- ✅ Future Stripe transactions (via webhook)
- ✅ Manual transactions (admin)

**Distinguisher:**
```sql
source_platform: 'ablefy' | 'stripe' | 'manual'
account_type: 'old' | 'new'
```

**Key Fields:**
- `trx_id` - Ablefy transaction ID (NULL for Stripe)
- `stripe_payment_intent_id` - Stripe ID (NULL for Ablefy)
- `order_id` - Links to unified orders table
- `course_id` - Mapped via course_mapping
- Financial data (amounts, fees, VAT)
- Buyer information
- Timestamps

---

### ✅ ONE `orders` Table (NOT separate ablefy_orders!)

**Stores:**
- ✅ Ablefy legacy orders (via import)
- ✅ Future Stripe orders (via webhook)
- ✅ Manual orders (admin)

**Distinguisher:**
```sql
source: 'ablefy' | 'stripe' | 'manual'
account_type: 'old' | 'new'
```

**Key Fields:**
- `ablefy_order_number` - For legacy (NULL for Stripe)
- `stripe_payment_intent_id` - For Stripe (NULL for Ablefy)
- `order_number` - Auto-generated: "ABL-12345" or "STR-pi_xxx"
- `buyer_email`, `buyer_first_name`, `buyer_last_name`
- `course_id` - Mapped course
- `status` - pending, paid, partial, failed, refunded, cancelled
- Aggregated financial data from transactions

---

### ✅ `course_mapping` Table

**Purpose:** Maps Ablefy product_id → Supabase course_id

**Structure:**
```sql
ablefy_product_id (INTEGER) → course_id (UUID)
```

**Example:**
| ablefy_product_id | course_id | course_title |
|-------------------|-----------|--------------|
| 419336 | uuid-xxx | Sterben für Anfänger |
| 443030 | uuid-yyy | Earth Code |
| 420632 | uuid-zzz | UFO Workshop |

---

## 🔄 Migration Workflow

### Phase 1: Preparation (Current) ✅
1. ✅ Analyze Airtable schema
2. ✅ Design unified Supabase schema
3. ✅ Create SQL migrations
4. 📋 Run migrations in Supabase
5. 📋 Populate course_mapping table

### Phase 2: Data Import
1. Import Orders first (from ablefy_orders Airtable)
2. Import Transactions (from ablefy_transactions Airtable)
3. Link transactions → orders via order_number
4. Map course_id via course_mapping (product_id → course_id)

### Phase 3: User Creation
1. Extract unique emails from orders
2. Create auth.users for all buyers
3. Send magic link for password setup
4. Link orders → users via email matching

### Phase 4: Access Derivation
1. Create user_courses entries for all paid orders
2. Grant course access based on orders
3. Validate access for all legacy customers

### Phase 5: Stripe Activation
1. Stripe account setup
2. Product/Price creation in Stripe
3. Webhook endpoint configuration
4. Parallel operation: Ablefy + Stripe

### Phase 6: Ablefy Sunset
1. Redirect all new orders to Stripe
2. Keep Ablefy for support/refunds only
3. Eventually decommission Ablefy

---

## 📦 Airtable Data Structure

### ablefy_transactions Table (tblqaRqGbbYKRpE6W)

**Sample Record:**
```json
{
  "trx_id": 919815274,
  "rechnungsnummer": "LOVE-002512",
  "datum": "08.03.2025 10:41",
  "status": "Erfolgreich",
  "typ": "Zahlungseingang",
  "zahlungsart": "PayPal",
  "order_number": 12863195,
  "product_id": 419336,
  "produkt": "Sterben für Anfänger",
  "bezahlt": 34.32,
  "bezahlt_minus_fee": 32.88,
  "fees_total": 1.44,
  "waehrung": "EUR",
  "plan": "Einmal",
  "gutscheincode": "COMMUNITYLOVE",
  "vorname": "Melanie",
  "nachname": "Partusch",
  "email": "m.partusch@gmx.de",
  "land": "Deutschland",
  "account_type": "new"
}
```

**Total Fields:** 47 fields
- IDs & References
- Financial data (amounts, fees, VAT)
- Buyer information (name, address, contact)
- Recipient info (for gifts)
- Payment details
- Accounting data

### ablefy_orders Table (tble6wOMHRy6fXkl9)

**Sample Fields:**
- order_number (BIGINT)
- buyer_email, first_name, last_name
- order_date
- status
- product_id → course_id (via link)
- amount_net, amount_gross, fees_total
- transactions_count (rollup)
- account_type

---

## 🔐 Access Derivation Logic

```sql
-- User has access if they have a PAID order for the course
SELECT EXISTS (
    SELECT 1 FROM orders
    WHERE user_id = auth.uid()
    AND course_id = $1
    AND status = 'paid'
) as has_access;
```

**Helper Functions Created:**
1. `get_user_course_access(user_id)` - Returns all accessible courses
2. `user_has_course_access(user_id, course_id)` - Boolean check
3. `get_course_from_ablefy_product(product_id)` - Map product → course

---

## 🚀 N8N Workflow Integration

### Workflow 1: Ablefy Transaction Sync (NEW)
**Trigger:** Webhook from Ablefy on new transaction  
**Actions:**
1. Parse transaction data
2. Find/Create order in Supabase
3. Insert transaction record
4. Update order financial aggregates
5. Check if fully paid → update order status
6. If paid → create/update user_courses access
7. Send confirmation email

### Workflow 2: Stripe Webhook Handler (FUTURE)
**Trigger:** Stripe webhook events  
**Actions:**
1. Handle payment_intent.succeeded
2. Create order record (source: 'stripe')
3. Create transaction record
4. Grant course access
5. Send confirmation email

---

## 📋 Migration Checklist

### Database Setup
- [ ] Run migrations in Supabase
  - [ ] transactions table
  - [ ] orders table  
  - [ ] course_mapping table
- [ ] Populate course_mapping from Airtable
- [ ] Test RLS policies
- [ ] Validate foreign key constraints

### Data Import
- [ ] Import Orders (~13k orders from Airtable)
- [ ] Import Transactions (~20k transactions from Airtable)
- [ ] Link transactions → orders
- [ ] Map course IDs via course_mapping
- [ ] Validate data integrity

### User Creation
- [ ] Extract unique emails from orders
- [ ] Bulk create auth.users
- [ ] Send magic links for password setup
- [ ] Link orders → users via email

### Access Derivation
- [ ] Create user_courses for paid orders
- [ ] Validate access for sample users
- [ ] Test in production

### N8N Setup
- [ ] Create Ablefy → Supabase sync workflow
- [ ] Test with sample transaction
- [ ] Deploy to production
- [ ] Monitor for errors

### Stripe Setup
- [ ] Create Stripe account
- [ ] Configure products & prices
- [ ] Setup webhook endpoint
- [ ] Test payment flow
- [ ] Deploy to production

---

## ⚠️ Important Notes

### Data Integrity
- **Order-Transaction Link:** Each transaction MUST link to an order
- **Course Mapping:** All product_ids MUST have course_id mapping
- **User Email:** Primary identifier until users are created

### Financial Data
- **Amounts:** Stored in cents? No, decimal(10,2) for Euro
- **Currency:** Stored as TEXT ("EUR", "CHF")
- **Fees:** Ablefy fees different from Stripe fees
- **VAT:** Different rates per country

### Payment Plans (Ratenzahlung)
- **Multiple Transactions:** One order, multiple transactions
- **Status Logic:** Order 'paid' when SUM(transactions.bezahlt) >= order.initial_amount
- **Tracking:** zahlungsplan_id links installments

---

## 🎯 Success Criteria

- ✅ All Ablefy data imported without loss
- ✅ Course access works for legacy customers
- ✅ Stripe payments work for new customers
- ✅ Parallel operation Ablefy + Stripe
- ✅ Clean unified data model
- ✅ No separate ablefy_* tables (unified!)

---

**Created:** 06.10.2025  
**Last Updated:** 06.10.2025  
**Status:** Ready for implementation
