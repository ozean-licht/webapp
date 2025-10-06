-- ===============================================
-- LINK ORDERS & TRANSACTIONS TO USERS
-- ===============================================
-- Verknüpft Orders und Transactions mit existierenden Users
-- Kann regelmäßig oder on-demand ausgeführt werden

-- Link transactions to users based on email
UPDATE transactions t
SET user_id = u.id
FROM auth.users u
WHERE LOWER(t.buyer_email) = LOWER(u.email)
  AND t.user_id IS NULL
  AND t.buyer_email IS NOT NULL;

-- Link orders to users based on email
UPDATE orders o
SET user_id = u.id
FROM auth.users u
WHERE LOWER(o.buyer_email) = LOWER(u.email)
  AND o.user_id IS NULL
  AND o.buyer_email IS NOT NULL;

-- Show results
SELECT 
  (SELECT COUNT(*) FROM transactions WHERE user_id IS NOT NULL) as transactions_with_user,
  (SELECT COUNT(*) FROM orders WHERE user_id IS NOT NULL) as orders_with_user,
  (SELECT COUNT(*) FROM auth.users) as total_users;
