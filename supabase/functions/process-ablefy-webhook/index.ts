import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface AblefyTransaction {
  trx_id: number
  relevante_id?: string
  rechnungsnummer?: string
  datum: string
  erfolgt_am?: string
  status: string
  typ: string
  zahlungsart: string
  order_number?: number
  product_id?: number
  produkt?: string
  psp?: string
  faelliger_betrag: number
  bezahlt: number
  bezahlt_minus_fee?: number
  waehrung: string
  fees_total?: number
  fees_service?: number
  fees_payment_provider?: number
  vat_rate?: number
  ust?: number
  plan?: string
  zahlungsplan_id?: number
  gutscheincode?: string
  vorname?: string
  nachname?: string
  email: string
  telefon?: string
  land?: string
  stadt?: string
  strasse?: string
  hausnummer?: string
  plz?: number
  ust_id?: string
  unternehmen?: string
  account_type: 'old' | 'new'
}

// Normalize status values
function normalizeStatus(status: string): string {
  if (!status) return 'Ausstehend'
  
  const statusLower = status.toLowerCase()
  
  const statusMap: Record<string, string> = {
    'successful': 'Erfolgreich',
    'pending': 'Ausstehend',
    'failed': 'Fehlgeschlagen',
    'refunded': 'Erstattet',
    'cancelled': 'Storniert'
  }
  
  return statusMap[statusLower] || status
}

// Normalize payment method values
function normalizePaymentMethod(method: string | null): string | null {
  if (!method) return null
  
  const methodLower = method.toLowerCase()
  
  const methodMap: Record<string, string> = {
    'paypal': 'PayPal',
    'card': 'Kreditkarte',
    'free': 'Kostenlos',
    'klarna': 'Klarna',
    'bank_wire': 'Vorkasse',
    'apple_pay': 'Apple Pay',
    'google_pay': 'Google Pay',
    'sepa': 'SEPA'
  }
  
  return methodMap[methodLower] || method
}

// Parse date strings
function parseDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  
  // Handle different date formats
  // Format 1: "08.03.2025 10:41"
  // Format 2: "2025-03-08T10:41:00.000Z"
  
  if (dateStr.includes('T')) {
    return new Date(dateStr).toISOString()
  }
  
  // Parse DD.MM.YYYY HH:mm format
  const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})/)
  if (match) {
    const [_, day, month, year, hour, minute] = match
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00.000Z`).toISOString()
  }
  
  return null
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify webhook secret
    const webhookSecret = req.headers.get('x-webhook-secret')
    const expectedSecret = Deno.env.get('N8N_WEBHOOK_SECRET')
    
    if (webhookSecret !== expectedSecret) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook secret' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const body = await req.json()
    const transaction = body as AblefyTransaction

    // Validate required fields
    if (!transaction.trx_id || !transaction.email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: trx_id and email are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Transform transaction data
    const transactionData = {
      // Ablefy Legacy IDs
      trx_id: transaction.trx_id,
      relevante_id: transaction.relevante_id || null,
      rechnungsnummer: transaction.rechnungsnummer || null,
      
      // Transaction Core Data
      transaction_date: parseDate(transaction.datum),
      datum_raw: transaction.datum,
      erfolgt_am: transaction.erfolgt_am || null,
      status: normalizeStatus(transaction.status),
      typ: transaction.typ,
      zahlungsart: normalizePaymentMethod(transaction.zahlungsart),
      
      // Order & Product Information
      order_number: transaction.order_number || null,
      product_id: transaction.product_id || null,
      produkt: transaction.produkt || null,
      psp: transaction.psp || null,
      
      // Financial Data
      faelliger_betrag: transaction.faelliger_betrag || 0,
      bezahlt: transaction.bezahlt || 0,
      bezahlt_minus_fee: transaction.bezahlt_minus_fee || null,
      fees_total: transaction.fees_total || 0,
      fees_service: transaction.fees_service || 0,
      fees_payment_provider: transaction.fees_payment_provider || 0,
      vat_rate: transaction.vat_rate || 0,
      ust: transaction.ust || 0,
      waehrung: transaction.waehrung || 'EUR',
      
      // Payment Plan
      plan: transaction.plan || null,
      zahlungsplan_id: transaction.zahlungsplan_id || null,
      gutscheincode: transaction.gutscheincode || null,
      
      // Buyer Information
      buyer_email: transaction.email,
      buyer_first_name: transaction.vorname || null,
      buyer_last_name: transaction.nachname || null,
      buyer_phone: transaction.telefon || null,
      buyer_land: transaction.land || null,
      buyer_stadt: transaction.stadt || null,
      buyer_strasse: transaction.strasse || null,
      buyer_hausnummer: transaction.hausnummer || null,
      buyer_plz: transaction.plz || null,
      buyer_ust_id: transaction.ust_id || null,
      buyer_unternehmen: transaction.unternehmen || null,
      
      // Account Type & Source
      account_type: transaction.account_type || 'new',
      source_platform: 'ablefy',
      imported_from_ablefy: true,
      imported_at: new Date().toISOString()
    }

    // Upsert transaction
    const { data: insertedTransaction, error: transactionError } = await supabase
      .from('transactions')
      .upsert(transactionData, {
        onConflict: 'trx_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (transactionError) {
      throw transactionError
    }

    // Check if order exists, create if not
    if (transaction.order_number) {
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('ablefy_order_number', transaction.order_number)
        .single()

      if (!existingOrder) {
        // Create order
        const orderData = {
          ablefy_order_number: transaction.order_number,
          buyer_email: transaction.email,
          buyer_first_name: transaction.vorname || null,
          buyer_last_name: transaction.nachname || null,
          order_date: parseDate(transaction.datum) || new Date().toISOString(),
          status: normalizeStatus(transaction.status) === 'Erfolgreich' ? 'paid' : 'pending',
          ablefy_product_id: transaction.product_id?.toString() || null,
          source: 'ablefy',
          account_type: transaction.account_type || 'new',
          imported_from_ablefy: true,
          imported_at: new Date().toISOString()
        }

        const { error: orderError } = await supabase
          .from('orders')
          .insert(orderData)

        if (orderError && orderError.code !== '23505') { // Ignore duplicate key errors
          console.error('Error creating order:', orderError)
        }
      }
    }

    // Link transaction to order
    if (transaction.order_number) {
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('ablefy_order_number', transaction.order_number)
        .single()

      if (order) {
        await supabase
          .from('transactions')
          .update({ order_id: order.id })
          .eq('trx_id', transaction.trx_id)
      }
    }

    // Map course if product_id exists
    if (transaction.product_id) {
      const { data: mapping } = await supabase
        .from('course_mapping')
        .select('course_id')
        .eq('ablefy_product_id', transaction.product_id)
        .eq('is_active', true)
        .single()

      if (mapping) {
        await supabase
          .from('transactions')
          .update({ course_id: mapping.course_id })
          .eq('trx_id', transaction.trx_id)

        // Also update order if exists
        if (transaction.order_number) {
          await supabase
            .from('orders')
            .update({ course_id: mapping.course_id })
            .eq('ablefy_order_number', transaction.order_number)
        }
      }
    }

    // Link to user if exists
    const { data: user } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', transaction.email.toLowerCase())
      .single()

    if (user) {
      await supabase
        .from('transactions')
        .update({ user_id: user.id })
        .eq('trx_id', transaction.trx_id)

      if (transaction.order_number) {
        await supabase
          .from('orders')
          .update({ user_id: user.id })
          .eq('ablefy_order_number', transaction.order_number)
      }
    }

    // Update order totals
    if (transaction.order_number) {
      await supabase.rpc('update_order_totals')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        transaction_id: insertedTransaction.id,
        message: 'Transaction processed successfully'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
