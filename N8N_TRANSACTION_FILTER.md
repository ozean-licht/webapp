# N8N Transaction Filter Setup

## 🎯 PROBLEM

Ablefy sendet **2 Events** pro Bestellung:

1. **`payment_processed`** 
   - ✅ Hat trx_id
   - ✅ Hat Betrag
   - ✅ Status: "successful"
   - **DAS WOLLEN WIR!**

2. **`subscription_state_changed`**
   - ❌ Keine trx_id
   - ❌ Betrag = €0
   - ❌ Status: "Ausstehend"
   - **BRAUCHEN WIR NICHT!**

## ✅ LÖSUNG: Filter in N8N

### In deinem N8N Workflow:

**Nach dem "Get Transaction from Airtable" Node:**

Füge einen **IF Node** hinzu mit:

```javascript
// Filter Bedingung
{{ $json.fields.typ === 'payment_processed' }}
```

**ODER:**

```javascript
// Alternative: Filter by trx_id exists
{{ $json.fields.trx_id != null && $json.fields.trx_id != '' }}
```

**ODER am einfachsten:**

```javascript
// Filter by status
{{ $json.fields.status === 'successful' || $json.fields.status === 'Erfolgreich' }}
```

### Workflow Struktur:

```
Airtable Webhook
    ↓
Get Transaction from Airtable
    ↓
IF (typ === 'payment_processed')  ← NEUER NODE
    ↓ TRUE
Send to Supabase
    ↓ FALSE
Stop (do nothing)
```

## 🎯 EMPFEHLUNG

**Nutze diesen Filter:**

```javascript
{{ $json.fields.typ === 'payment_processed' }}
```

**Warum?**
- ✅ Nur echte Zahlungen werden verarbeitet
- ✅ Vermeidet Duplikate
- ✅ Verhindert NULL trx_id Probleme

## 📊 TRANSACTION TYPEN IN ABLEFY

Häufige Typen:
- `payment_processed` - **Verwenden** ✅
- `subscription_state_changed` - **Ignorieren** ❌
- `payment_failed` - Optional loggen
- `refund` - Optional für Refunds nutzen
- `subscription_cancelled` - Optional loggen

## 🔧 ALTERNATIVE: Filter in Airtable Automation

Wenn du Airtable Automation statt N8N nutzt:

**Bedingung im Automation Trigger:**
```
When record matches conditions:
  typ = "payment_processed"
  AND
  status = "successful"
```

---

**Nach dem Setup:** Nur noch 1 Transaction pro Bestellung! 🎉
