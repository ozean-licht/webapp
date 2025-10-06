#!/usr/bin/env node

/**
 * ABLEFY TRANSACTIONS ANALYSIS SCRIPT
 * ===================================
 * Analyzes Airtable ablefy_transactions to prepare for migration
 */

require('dotenv').config({ path: '.env.local' });

const AIRTABLE_BASE_ID = 'app5e7mJQhxDYD5Zy';
const AIRTABLE_TRANSACTIONS_TABLE = 'tblqaRqGbbYKRpE6W';
const AIRTABLE_ORDERS_TABLE = 'tble6wOMHRy6fXkl9';
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

if (!AIRTABLE_API_KEY) {
  console.error('❌ Missing AIRTABLE_API_KEY in .env.local');
  process.exit(1);
}

console.log('🔍 Analyzing Ablefy Transactions from Airtable');
console.log('='.repeat(60));

async function analyzeTransactions() {
  try {
    // Fetch transactions from Airtable
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TRANSACTIONS_TABLE}?maxRecords=100&view=Grid%20view`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const records = data.records;

    console.log(`\n📊 Total records fetched: ${records.length}`);
    
    if (records.length > 0) {
      // Analyze first record structure
      const sampleRecord = records[0].fields;
      console.log('\n📋 Available fields in ablefy_transactions:');
      console.log('=' .repeat(40));
      
      Object.keys(sampleRecord).forEach(key => {
        const value = sampleRecord[key];
        const type = Array.isArray(value) ? 'array' : typeof value;
        console.log(`  ${key}: ${type}`);
        if (key === 'account_type' || key === 'status' || key === 'typ' || key === 'zahlungsart') {
          console.log(`    → Sample value: ${value}`);
        }
      });

      // Analyze account_type distribution
      const accountTypes = {};
      const statuses = {};
      const types = {};
      const paymentMethods = {};
      
      records.forEach(record => {
        const fields = record.fields;
        
        // Count account types
        const accountType = fields.account_type || 'unknown';
        accountTypes[accountType] = (accountTypes[accountType] || 0) + 1;
        
        // Count statuses
        const status = fields.status || 'unknown';
        statuses[status] = (statuses[status] || 0) + 1;
        
        // Count transaction types
        const typ = fields.typ || 'unknown';
        types[typ] = (types[typ] || 0) + 1;
        
        // Count payment methods
        const zahlungsart = fields.zahlungsart || 'unknown';
        paymentMethods[zahlungsart] = (paymentMethods[zahlungsart] || 0) + 1;
      });

      console.log('\n📈 Account Type Distribution:');
      console.log('=' .repeat(40));
      Object.entries(accountTypes).forEach(([type, count]) => {
        console.log(`  ${type}: ${count} (${((count/records.length)*100).toFixed(1)}%)`);
      });

      console.log('\n📊 Transaction Status Distribution:');
      console.log('=' .repeat(40));
      Object.entries(statuses).forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`);
      });

      console.log('\n💳 Payment Methods:');
      console.log('=' .repeat(40));
      Object.entries(paymentMethods).forEach(([method, count]) => {
        console.log(`  ${method}: ${count}`);
      });

      console.log('\n📅 Date Range:');
      console.log('=' .repeat(40));
      const dates = records
        .map(r => r.fields.datum)
        .filter(d => d)
        .sort();
      
      if (dates.length > 0) {
        console.log(`  Earliest: ${dates[0]}`);
        console.log(`  Latest: ${dates[dates.length - 1]}`);
      }

      // Check for order references
      const withOrderNumber = records.filter(r => r.fields.order_number).length;
      const withProductId = records.filter(r => r.fields.product_id).length;
      
      console.log('\n🔗 Relationships:');
      console.log('=' .repeat(40));
      console.log(`  With order_number: ${withOrderNumber} (${((withOrderNumber/records.length)*100).toFixed(1)}%)`);
      console.log(`  With product_id: ${withProductId} (${((withProductId/records.length)*100).toFixed(1)}%)`);

      // Financial summary
      let totalAmount = 0;
      let totalFees = 0;
      records.forEach(r => {
        if (r.fields.bezahlt) totalAmount += parseFloat(r.fields.bezahlt);
        if (r.fields.fees_total) totalFees += parseFloat(r.fields.fees_total);
      });

      console.log('\n💰 Financial Summary:');
      console.log('=' .repeat(40));
      console.log(`  Total Amount: €${totalAmount.toFixed(2)}`);
      console.log(`  Total Fees: €${totalFees.toFixed(2)}`);
      console.log(`  Net Revenue: €${(totalAmount - totalFees).toFixed(2)}`);
    }

    // Now check orders table
    console.log('\n\n📦 Checking Ablefy Orders Table...');
    console.log('=' .repeat(60));
    
    const ordersResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_ORDERS_TABLE}?maxRecords=10&view=Grid%20view`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json();
      const orderRecords = ordersData.records;
      
      console.log(`  Total orders (sample): ${orderRecords.length}`);
      
      if (orderRecords.length > 0) {
        const sampleOrder = orderRecords[0].fields;
        console.log('\n📋 Available fields in ablefy_orders:');
        Object.keys(sampleOrder).forEach(key => {
          const value = sampleOrder[key];
          const type = Array.isArray(value) ? 'array' : typeof value;
          console.log(`  ${key}: ${type}`);
        });
      }
    }

    console.log('\n\n✅ Analysis complete!');
    console.log('\n📝 Next Steps:');
    console.log('1. Run course_mapping sync first');
    console.log('2. Import orders (if needed)');
    console.log('3. Import transactions with proper mappings');
    console.log('4. Set up N8N workflow for real-time sync');

  } catch (error) {
    console.error('💥 Error:', error.message);
    process.exit(1);
  }
}

// Run analysis
analyzeTransactions();
