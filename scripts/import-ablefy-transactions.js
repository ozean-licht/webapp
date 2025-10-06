#!/usr/bin/env node

/**
 * ABLEFY TRANSACTIONS IMPORT SCRIPT
 * ==================================
 * Imports legacy Ablefy transactions from Airtable to Supabase
 * 
 * Prerequisites:
 * 1. Run Supabase migrations (transactions, orders, course_mapping tables)
 * 2. Set environment variables (AIRTABLE_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY)
 * 3. Populate course_mapping table first
 * 
 * Usage:
 *   node scripts/import-ablefy-transactions.js [preview|import|validate]
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const AIRTABLE_BASE_ID = 'app5e7mJQhxDYD5Zy'
const AIRTABLE_TRANSACTIONS_TABLE = 'tblqaRqGbbYKRpE6W'
const AIRTABLE_ORDERS_TABLE = 'tble6wOMHRy6fXkl9'
const AIRTABLE_COURSE_MAPPING_TABLE = 'tblS5nhisQH2xsCPs'
const BATCH_SIZE = 100

// Parse command line arguments
const mode = process.argv[2] || 'preview' // preview, import, validate

// Initialize Supabase client only if needed
let supabase = null;
if (mode !== 'preview') {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && serviceKey) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKey
    );
  }
}

console.log(`🚀 Ablefy Transaction Import - Mode: ${mode.toUpperCase()}`)
console.log('=' .repeat(60))

// Helper function to check environment
function checkEnvironment() {
  const required = ['AIRTABLE_API_KEY'];
  
  // Only require Supabase keys for import/validate modes
  if (mode !== 'preview') {
    required.push('NEXT_PUBLIC_SUPABASE_URL');
    // Accept either SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY
    if (!process.env.SUPABASE_SERVICE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      required.push('SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY');
    }
  }
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.log('\n📝 Add to your .env.local file:');
    missing.forEach(key => {
      console.log(`${key}=your_${key.toLowerCase()}_here`);
    });
    return false;
  }
  
  return true;
}

// Helper function to parse date strings
function parseDate(dateStr) {
  if (!dateStr) return null;
  
  // Handle different date formats
  // Format 1: "08.03.2025 10:41"
  // Format 2: "2025-03-08T10:41:00.000Z"
  
  if (dateStr.includes('T')) {
    return new Date(dateStr);
  }
  
  // Parse DD.MM.YYYY HH:mm format
  const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})/);
  if (match) {
    const [_, day, month, year, hour, minute] = match;
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00.000Z`);
  }
  
  return null;
}

async function main() {
  try {
    // Check environment first
    if (!checkEnvironment()) {
      process.exit(1);
    }
    
    switch(mode) {
      case 'preview':
        await previewTransactions()
        break
      case 'import':
        await importTransactions()
        break
      case 'validate':
        await validateImport()
        break
      default:
        console.error('❌ Invalid mode. Use: preview, import, or validate')
        process.exit(1)
    }
  } catch (error) {
    console.error('💥 Import failed:', error.message)
    process.exit(1)
  }
}

// Fetch records from Airtable with pagination
async function fetchAirtableRecords(tableId, view = 'Grid view', offset = null) {
  const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`);
  if (view) {
    url.searchParams.append('view', view);
  }
  url.searchParams.append('pageSize', '100');
  if (offset) {
    url.searchParams.append('offset', offset);
  }
  
  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch all records from a table
async function fetchAllAirtableRecords(tableId, view = 'Grid view') {
  let allRecords = [];
  let offset = null;
  
  do {
    const data = await fetchAirtableRecords(tableId, view, offset);
    allRecords = allRecords.concat(data.records);
    offset = data.offset;
    
    if (offset) {
      console.log(`  Fetched ${allRecords.length} records so far...`);
    }
  } while (offset);
  
  return allRecords;
}

async function previewTransactions() {
  console.log('📊 Preview Mode - Analyzing Airtable data...\n');
  
  // Fetch transactions
  console.log('🔍 Fetching transactions from Airtable...');
  const transactions = await fetchAllAirtableRecords(AIRTABLE_TRANSACTIONS_TABLE);
  console.log(`  ✅ Found ${transactions.length} transactions`);
  
  // Analyze data
  const stats = {
    total: transactions.length,
    byAccountType: {},
    byStatus: {},
    byPaymentMethod: {},
    withOrderNumber: 0,
    withProductId: 0,
    dateRange: { earliest: null, latest: null },
    totalAmount: 0,
    totalFees: 0
  };
  
  transactions.forEach(record => {
    const fields = record.fields;
    
    // Account types
    const accountType = fields.account_type || 'unknown';
    stats.byAccountType[accountType] = (stats.byAccountType[accountType] || 0) + 1;
    
    // Status
    const status = fields.status || 'unknown';
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
    
    // Payment methods
    const paymentMethod = fields.zahlungsart || 'unknown';
    stats.byPaymentMethod[paymentMethod] = (stats.byPaymentMethod[paymentMethod] || 0) + 1;
    
    // Relationships
    if (fields.order_number) stats.withOrderNumber++;
    if (fields.product_id) stats.withProductId++;
    
    // Financial
    if (fields.bezahlt) stats.totalAmount += parseFloat(fields.bezahlt);
    if (fields.fees_total) stats.totalFees += parseFloat(fields.fees_total);
    
    // Date range
    const date = parseDate(fields.datum);
    if (date) {
      if (!stats.dateRange.earliest || date < stats.dateRange.earliest) {
        stats.dateRange.earliest = date;
      }
      if (!stats.dateRange.latest || date > stats.dateRange.latest) {
        stats.dateRange.latest = date;
      }
    }
  });
  
  // Display statistics
  console.log('\n📈 Transaction Statistics:');
  console.log('=' .repeat(40));
  console.log(`Total transactions: ${stats.total}`);
  
  console.log('\nBy Account Type:');
  Object.entries(stats.byAccountType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} (${((count/stats.total)*100).toFixed(1)}%)`);
  });
  
  console.log('\nBy Status:');
  Object.entries(stats.byStatus).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
  
  console.log('\nBy Payment Method:');
  Object.entries(stats.byPaymentMethod).forEach(([method, count]) => {
    console.log(`  ${method}: ${count}`);
  });
  
  console.log('\nRelationships:');
  console.log(`  With order_number: ${stats.withOrderNumber} (${((stats.withOrderNumber/stats.total)*100).toFixed(1)}%)`);
  console.log(`  With product_id: ${stats.withProductId} (${((stats.withProductId/stats.total)*100).toFixed(1)}%)`);
  
  console.log('\nFinancial Summary:');
  console.log(`  Total Amount: €${stats.totalAmount.toFixed(2)}`);
  console.log(`  Total Fees: €${stats.totalFees.toFixed(2)}`);
  console.log(`  Net Revenue: €${(stats.totalAmount - stats.totalFees).toFixed(2)}`);
  
  if (stats.dateRange.earliest && stats.dateRange.latest) {
    console.log('\nDate Range:');
    console.log(`  Earliest: ${stats.dateRange.earliest.toISOString().split('T')[0]}`);
    console.log(`  Latest: ${stats.dateRange.latest.toISOString().split('T')[0]}`);
  }
  
  // Fetch orders
  console.log('\n\n🔍 Fetching orders from Airtable...');
  const orders = await fetchAllAirtableRecords(AIRTABLE_ORDERS_TABLE);
  console.log(`  ✅ Found ${orders.length} orders`);
  
  // Fetch course mapping
  console.log('\n🔍 Fetching course mappings...');
  const mappings = await fetchAllAirtableRecords(AIRTABLE_COURSE_MAPPING_TABLE);
  console.log(`  ✅ Found ${mappings.length} course mappings`);
  
  console.log('\n✅ Preview complete. Use "import" mode to start migration.');
}

// Normalize status values
function normalizeStatus(status) {
  if (!status) return 'Ausstehend';
  
  const statusLower = status.toLowerCase();
  
  // Map English to German status values
  const statusMap = {
    'successful': 'Erfolgreich',
    'pending': 'Ausstehend',
    'failed': 'Fehlgeschlagen',
    'refunded': 'Erstattet',
    'cancelled': 'Storniert'
  };
  
  // Check if it's an English status
  if (statusMap[statusLower]) {
    return statusMap[statusLower];
  }
  
  // Return original if already German or unknown
  return status;
}

// Normalize payment method values
function normalizePaymentMethod(method) {
  if (!method) return null;
  
  const methodLower = method.toLowerCase();
  
  // Map English to German payment methods
  const methodMap = {
    'paypal': 'PayPal',
    'card': 'Kreditkarte',
    'free': 'Kostenlos',
    'klarna': 'Klarna',
    'bank_wire': 'Vorkasse',
    'apple_pay': 'Apple Pay',
    'google_pay': 'Google Pay',
    'sepa': 'SEPA'
  };
  
  // Check if it's an English method
  if (methodMap[methodLower]) {
    return methodMap[methodLower];
  }
  
  // Return original if already German or unknown
  return method;
}

// Transform Airtable transaction to Supabase format
function transformTransaction(airtableRecord) {
  const fields = airtableRecord.fields;
  
  // Parse dates
  const transactionDate = parseDate(fields.datum);
  const erfolgtAmDate = fields.erfolgt_am ? parseDate(fields.erfolgt_am) : null;
  
  return {
    // Ablefy Legacy IDs
    trx_id: fields.trx_id || null,
    relevante_id: fields.relevante_id || null,
    rechnungsnummer: fields.rechnungsnummer || null,
    
    // Transaction Core Data
    transaction_date: transactionDate ? transactionDate.toISOString() : null,
    datum_raw: fields.datum || null,
    erfolgt_am: fields.erfolgt_am || null,
    status: normalizeStatus(fields.status),
    typ: fields.typ || null,
    zahlungsart: normalizePaymentMethod(fields.zahlungsart),
    
    // Order & Product Information
    order_number: fields.order_number || null,
    product_id: fields.product_id || null,
    produkt: fields.produkt || null,
    psp: fields.psp || null,
    
    // Financial Data
    faelliger_betrag: parseFloat(fields.faelliger_betrag) || 0,
    bezahlt: parseFloat(fields.bezahlt) || 0,
    bezahlt_minus_fee: parseFloat(fields.bezahlt_minus_fee) || null,
    netto: parseFloat(fields.netto) || null,
    einnahmen_netto: parseFloat(fields.einnahmen_netto) || null,
    
    // Fees
    fees_total: parseFloat(fields.fees_total) || 0,
    fees_service: parseFloat(fields.fees_service) || 0,
    fees_payment_provider: parseFloat(fields.fees_payment_provider) || 0,
    
    // Tax
    vat_rate: parseFloat(fields.vat_rate) || 0,
    ust: parseFloat(fields.ust) || 0,
    steuerkategorie: fields.steuerkategorie || null,
    
    // Currency
    waehrung: fields.waehrung || 'EUR',
    
    // Payment Plan
    plan: fields.plan || null,
    zahlungsplan_id: fields.zahlungsplan_id || null,
    faelligkeiten_id: fields.faelligkeiten_id || null,
    
    // Discount
    gutscheincode: fields.gutscheincode || null,
    
    // Buyer Information
    buyer_email: fields.email || null,
    buyer_first_name: fields.vorname || null,
    buyer_last_name: fields.nachname || null,
    buyer_phone: fields.telefon || null,
    
    // Billing Address
    buyer_land: fields.land || null,
    buyer_stadt: fields.stadt || null,
    buyer_strasse: fields.strasse || null,
    buyer_hausnummer: fields.hausnummer || null,
    buyer_plz: fields.plz || null,
    buyer_adress_zusatz: fields.adress_zusatz || null,
    buyer_country_code: fields.country_code || null,
    buyer_ust_id: fields.ust_id || null,
    buyer_unternehmen: fields.unternehmen || null,
    
    // Recipient Information (for gifts)
    recipient_name: fields.empfaenger_name || null,
    recipient_email: fields.empfaenger_email || null,
    recipient_phone: fields.empfaenger_telefon || null,
    recipient_land: fields.empfaenger_land || null,
    recipient_strasse: fields.empfaenger_strasse || null,
    recipient_hausnummer: fields.empfaenger_hausnummer || null,
    recipient_firma: fields.empfaenger_firma || null,
    
    // Accounting & Metadata
    rechnungs_id: fields.rechnungs_id || null,
    rechnungsdatum: fields.rechnungsdatum || null,
    ext_id: fields.ext_id || null,
    gutschrift: fields.gutschrift || null,
    
    // Account Type & Source
    account_type: fields.account_type || 'new',
    source_platform: 'ablefy',
    
    // Import metadata
    imported_from_ablefy: true,
    imported_at: new Date().toISOString()
  };
}

// Transform Airtable order to Supabase format
function transformOrder(airtableRecord) {
  const fields = airtableRecord.fields;
  
  const orderDate = fields.order_date ? new Date(fields.order_date) : null;
  
  return {
    // Ablefy specific
    ablefy_order_number: fields.order_number || null,
    
    // Buyer Information
    buyer_email: fields.buyer_email || null,
    buyer_first_name: fields.first_name || null,
    buyer_last_name: fields.last_name || null,
    
    // Order Data
    order_date: orderDate ? orderDate.toISOString() : null,
    status: fields.status === 'success' ? 'paid' : 'pending',
    
    // Product & Course
    ablefy_product_id: fields.product_id || null,
    invoice_id: fields.invoice_id || null,
    
    // Financial Data
    amount_net: parseFloat(fields.amount_net) || null,
    amount_gross: parseFloat(fields.amount_gross) || null,
    amount_minus_fees: parseFloat(fields.amount_minus_fees) || null,
    initial_amount: parseFloat(fields.initial_amount) || null,
    fees_total: parseFloat(fields.fees_total) || 0,
    transactions_count: fields.transactions_count || 0,
    currency: 'EUR',
    
    // Source & Type
    source: 'ablefy',
    account_type: fields.account_type || 'new',
    
    // Import metadata
    imported_from_ablefy: true,
    imported_at: new Date().toISOString()
  };
}

async function importTransactions() {
  console.log('🔄 Import Mode - Starting migration...\n');
  
  try {
    // Step 0: Import course mappings
    console.log('📚 Step 0: Importing course mappings...');
    const mappings = await fetchAllAirtableRecords(AIRTABLE_COURSE_MAPPING_TABLE);
    console.log(`  Found ${mappings.length} mappings`);
    
    // Clear existing mappings
    const { error: deleteError } = await supabase
      .from('course_mapping')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (deleteError) {
      console.error('  ❌ Error clearing mappings:', deleteError.message);
    }
    
    // Transform mappings
    const mappingData = mappings.map(record => ({
      ablefy_product_id: record.fields.ablefy_product_id,
      course_id: record.fields.course_id || null,
      course_title: record.fields.course_title || null,
      is_active: true
    })).filter(m => m.ablefy_product_id && m.course_id);
    
    // Insert mappings
    if (mappingData.length > 0) {
      const { data, error } = await supabase
        .from('course_mapping')
        .insert(mappingData);
      
      if (error) {
        console.error('  ❌ Error inserting mappings:', error.message);
      } else {
        console.log(`  ✅ Imported ${mappingData.length} course mappings`);
      }
    }
    
    // Step 1: Import Orders
    console.log('\n📦 Step 1: Importing orders...');
    const orders = await fetchAllAirtableRecords(AIRTABLE_ORDERS_TABLE);
    console.log(`  Found ${orders.length} orders`);
    
    // Process orders in batches
    for (let i = 0; i < orders.length; i += BATCH_SIZE) {
      const batch = orders.slice(i, i + BATCH_SIZE);
      const orderData = batch.map(transformOrder);
      
      const { data, error } = await supabase
        .from('orders')
        .upsert(orderData, {
          onConflict: 'ablefy_order_number',
          ignoreDuplicates: false
        });
      
      if (error) {
        console.error(`  ❌ Error in batch ${Math.floor(i/BATCH_SIZE) + 1}:`, error.message);
      } else {
        console.log(`  ✅ Imported batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(orders.length/BATCH_SIZE)}`);
      }
    }
    
    // Step 2: Import Transactions
    console.log('\n💰 Step 2: Importing transactions...');
    const transactions = await fetchAllAirtableRecords(AIRTABLE_TRANSACTIONS_TABLE);
    console.log(`  Found ${transactions.length} transactions`);
    
    // Process transactions in batches
    for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
      const batch = transactions.slice(i, i + BATCH_SIZE);
      const transactionData = batch.map(transformTransaction)
        .filter(t => t.trx_id); // Only import records with valid trx_id
      
      const { data, error } = await supabase
        .from('transactions')
        .upsert(transactionData, {
          onConflict: 'trx_id',
          ignoreDuplicates: false
        });
      
      if (error) {
        console.error(`  ❌ Error in batch ${Math.floor(i/BATCH_SIZE) + 1}:`, error.message);
      } else {
        console.log(`  ✅ Imported batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(transactions.length/BATCH_SIZE)}`);
      }
    }
    
    // Step 3: Link transactions to orders
    console.log('\n🔗 Step 3: Linking transactions to orders...');
    const { data: linkedData, error: linkError } = await supabase.rpc('link_transactions_to_orders');
    
    if (linkError) {
      console.log('  ⚠️  No linking function found, manual linking required');
    } else {
      console.log('  ✅ Transactions linked to orders');
    }
    
    // Step 4: Update course IDs via mapping
    console.log('\n🎓 Step 4: Mapping courses...');
    const { data: mappedData, error: mapError } = await supabase.rpc('map_courses_from_products');
    
    if (mapError) {
      console.log('  ⚠️  No mapping function found, manual mapping required');
    } else {
      console.log('  ✅ Courses mapped successfully');
    }
    
    console.log('\n✅ Import complete!');
    
  } catch (error) {
    console.error('\n💥 Import failed:', error.message);
    throw error;
  }
}

async function validateImport() {
  console.log('✓ Validation Mode - Checking data integrity...\n');
  
  try {
    // Get counts from Airtable
    console.log('📊 Fetching Airtable counts...');
    const airtableTransactions = await fetchAllAirtableRecords(AIRTABLE_TRANSACTIONS_TABLE);
    const airtableOrders = await fetchAllAirtableRecords(AIRTABLE_ORDERS_TABLE);
    
    // Get counts from Supabase
    console.log('📊 Fetching Supabase counts...');
    
    const { count: transactionCount, error: tError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('source_platform', 'ablefy');
    
    const { count: orderCount, error: oError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('source', 'ablefy');
    
    const { count: mappingCount, error: mError } = await supabase
      .from('course_mapping')
      .select('*', { count: 'exact', head: true });
    
    // Display comparison
    console.log('\n📈 Record Count Comparison:');
    console.log('=' .repeat(50));
    console.log(`Transactions:`);
    console.log(`  Airtable: ${airtableTransactions.length}`);
    console.log(`  Supabase: ${transactionCount || 0}`);
    console.log(`  Match: ${transactionCount === airtableTransactions.length ? '✅' : '❌'}`);
    
    console.log(`\nOrders:`);
    console.log(`  Airtable: ${airtableOrders.length}`);
    console.log(`  Supabase: ${orderCount || 0}`);
    console.log(`  Match: ${orderCount === airtableOrders.length ? '✅' : '❌'}`);
    
    console.log(`\nCourse Mappings:`);
    console.log(`  Supabase: ${mappingCount || 0}`);
    
    // Check financial totals
    console.log('\n💰 Financial Validation:');
    console.log('=' .repeat(50));
    
    // Calculate Airtable totals
    let airtableTotal = 0;
    let airtableFees = 0;
    airtableTransactions.forEach(record => {
      if (record.fields.bezahlt) airtableTotal += parseFloat(record.fields.bezahlt);
      if (record.fields.fees_total) airtableFees += parseFloat(record.fields.fees_total);
    });
    
    // Get Supabase totals
    const { data: financialData } = await supabase
      .from('transactions')
      .select('bezahlt, fees_total')
      .eq('source_platform', 'ablefy')
      .eq('status', 'Erfolgreich');
    
    let supabaseTotal = 0;
    let supabaseFees = 0;
    if (financialData) {
      financialData.forEach(row => {
        if (row.bezahlt) supabaseTotal += parseFloat(row.bezahlt);
        if (row.fees_total) supabaseFees += parseFloat(row.fees_total);
      });
    }
    
    console.log(`Total Amount:`);
    console.log(`  Airtable: €${airtableTotal.toFixed(2)}`);
    console.log(`  Supabase: €${supabaseTotal.toFixed(2)}`);
    console.log(`  Difference: €${Math.abs(airtableTotal - supabaseTotal).toFixed(2)}`);
    
    console.log(`\nTotal Fees:`);
    console.log(`  Airtable: €${airtableFees.toFixed(2)}`);
    console.log(`  Supabase: €${supabaseFees.toFixed(2)}`);
    console.log(`  Difference: €${Math.abs(airtableFees - supabaseFees).toFixed(2)}`);
    
    // Check sample records
    console.log('\n🔍 Sample Record Check:');
    console.log('=' .repeat(50));
    
    // Get a sample transaction from Airtable
    const sampleTrx = airtableTransactions.find(t => t.fields.trx_id);
    if (sampleTrx) {
      const { data: dbTrx } = await supabase
        .from('transactions')
        .select('*')
        .eq('trx_id', sampleTrx.fields.trx_id)
        .single();
      
      if (dbTrx) {
        console.log(`Sample Transaction ${sampleTrx.fields.trx_id}:`);
        console.log(`  Email match: ${dbTrx.buyer_email === sampleTrx.fields.email ? '✅' : '❌'}`);
        console.log(`  Amount match: ${dbTrx.bezahlt == sampleTrx.fields.bezahlt ? '✅' : '❌'}`);
        console.log(`  Status match: ${dbTrx.status === sampleTrx.fields.status ? '✅' : '❌'}`);
      }
    }
    
    console.log('\n✅ Validation complete!');
    
  } catch (error) {
    console.error('\n💥 Validation failed:', error.message);
    throw error;
  }
}

// Run main function
if (require.main === module) {
  main();
}

module.exports = { main, previewTransactions, importTransactions, validateImport }

