#!/bin/bash

# ===============================================
# DEPLOY AUTO ORDER CREATION
# ===============================================

echo "🚀 Deploying Auto Order Creation Setup"
echo "======================================"
echo ""

cd "$(dirname "$0")"

echo "📋 Option 1: Database Trigger (Empfohlen)"
echo "----------------------------------------"
echo ""
echo "Öffne Supabase Dashboard → SQL Editor"
echo "Dann führe aus: sql/setup-auto-order-creation.sql"
echo ""
echo "Nach Ausführung ist das Setup KOMPLETT!"
echo ""
echo "✅ Test mit: Mache eine Bestellung und prüfe ob Order automatisch erstellt wird"
echo ""
echo "📊 Monitoring Query:"
echo ""
cat << 'SQL'
SELECT COUNT(*) as transactions_without_orders
FROM transactions
WHERE order_number IS NOT NULL
  AND order_id IS NULL;
SQL
echo ""
echo "Sollte 0 sein!"
echo ""
