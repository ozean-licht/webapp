-- ================================================
-- LINK ORDERS AND MAP COURSES
-- ================================================
-- Führe diese SQL-Befehle in Supabase SQL Editor aus
-- um Orders mit Transactions zu verlinken und Course IDs zu mappen

-- 1. Link Transactions to Orders (order_id setzen)
-- ================================================
-- Dies verknüpft transactions.order_id → orders.id
-- Basierend auf order_number = ablefy_order_number

UPDATE transactions t
SET order_id = o.id
FROM orders o
WHERE t.order_number = o.ablefy_order_number
AND t.order_id IS NULL;

-- Erwartetes Ergebnis: ~1.700 Transactions verlinkt


-- 2. Map Course IDs to Orders
-- ================================================
-- Dies setzt orders.course_id basierend auf course_mapping
-- Damit Orders wissen welchen Kurs sie freigeschaltet haben

UPDATE orders o
SET course_id = cm.course_id
FROM course_mapping cm
WHERE o.ablefy_product_id = cm.ablefy_product_id::text
AND o.course_id IS NULL;

-- Erwartetes Ergebnis: ~1.000 Orders erhalten course_id


-- 3. Verification Queries
-- ================================================

-- Check wie viele Transactions jetzt order_id haben
SELECT 
  COUNT(*) as total,
  COUNT(order_id) as with_order_id,
  ROUND(COUNT(order_id)::numeric / COUNT(*)::numeric * 100, 2) as percentage
FROM transactions;

-- Check wie viele Orders jetzt course_id haben
SELECT 
  COUNT(*) as total,
  COUNT(course_id) as with_course_id,
  ROUND(COUNT(course_id)::numeric / COUNT(*)::numeric * 100, 2) as percentage
FROM orders;

-- Check die 3 fehlenden Orders von vorhin
SELECT * FROM orders 
WHERE ablefy_order_number IN ('14462512', '14462314', '14462294')
ORDER BY created_at DESC;
