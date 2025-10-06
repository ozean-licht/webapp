#!/bin/bash

# ============================================================================
# ABLEFY IMPORT QUICKSTART
# ============================================================================
# Führt alle Schritte für den Ablefy Import durch
# ============================================================================

echo "🚀 Ablefy Import Quickstart"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check environment
echo "📋 Schritt 1: Environment Check"
echo "----------------------------------------"
node scripts/check-supabase-tables.js
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Environment Check fehlgeschlagen${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Environment OK${NC}\n"

# Step 2: Reminder to run SQL
echo "📝 Schritt 2: Tabellen-Struktur"
echo "----------------------------------------"
echo -e "${YELLOW}⚠️  WICHTIG: Führe folgendes SQL in Supabase SQL Editor aus:${NC}"
echo ""
echo "   Datei: sql/recreate-orders-transactions.sql"
echo ""
echo -e "${YELLOW}Drücke ENTER wenn du das SQL ausgeführt hast...${NC}"
read -p ""

# Step 3: Test webhook
echo ""
echo "🧪 Schritt 3: Webhook Test"
echo "----------------------------------------"
node scripts/test-ablefy-webhook.js
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Webhook Test fehlgeschlagen${NC}"
    echo "Überprüfe die Edge Function Logs in Supabase Dashboard"
    exit 1
fi
echo -e "${GREEN}✅ Webhook funktioniert${NC}\n"

# Step 4: Confirm import
echo "📦 Schritt 4: Daten Import"
echo "----------------------------------------"
echo -e "${YELLOW}Bereit zum Import von:${NC}"
echo "  - 40.893 Transaktionen"
echo "  - 38.474 Orders"
echo "  - €2.1M Gesamtumsatz"
echo ""
read -p "Import starten? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔄 Starte Import..."
    node scripts/import-ablefy-transactions.js import
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Import erfolgreich${NC}\n"
        
        # Step 5: Validate
        echo "✓ Schritt 5: Validierung"
        echo "----------------------------------------"
        node scripts/import-ablefy-transactions.js validate
        
        echo ""
        echo -e "${GREEN}🎉 Ablefy Import abgeschlossen!${NC}"
        echo ""
        echo "📝 Nächste Schritte:"
        echo "  1. Überprüfe Daten in Supabase Dashboard"
        echo "  2. Teste Course Access für Sample User"
        echo "  3. Konfiguriere N8N Workflow für Echtzeit-Sync"
        echo "  4. Aktiviere Monitoring"
    else
        echo -e "${RED}❌ Import fehlgeschlagen${NC}"
        exit 1
    fi
else
    echo ""
    echo "Import abgebrochen. Du kannst ihn später mit diesem Befehl starten:"
    echo "  node scripts/import-ablefy-transactions.js import"
fi
