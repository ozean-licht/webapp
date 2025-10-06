import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface Transaction {
  trx_id: number
  order_number?: number
  buyer_email: string
  buyer_first_name?: string
  buyer_last_name?: string
  transaction_date: string
  status: string
  product_id?: number
  produkt?: string
  bezahlt: number
  account_type: string
  source_platform: 'ablefy' | 'stripe'
}

Deno.serve(async (req) => {
  try {
    // Parse webhook payload (from Database Webhook)
    const payload = await req.json()
    const transaction = payload.record as Transaction
    
    console.log('Processing transaction:', transaction.trx_id)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Only process if transaction has order_number
    if (!transaction.order_number) {
      console.log('No order_number, skipping')
      return new Response(
        JSON.stringify({ message: 'No order_number, skipped' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check if order already exists
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('ablefy_order_number', transaction.order_number)
      .single()

    if (existingOrder) {
      console.log('Order already exists:', existingOrder.id)
      
      // Link transaction to order if not linked
      await supabase
        .from('transactions')
        .update({ order_id: existingOrder.id })
        .eq('trx_id', transaction.trx_id)
        .is('order_id', null)
      
      return new Response(
        JSON.stringify({ message: 'Order exists, transaction linked' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create new order
    console.log('Creating new order:', transaction.order_number)
    
    const orderData = {
      ablefy_order_number: transaction.order_number,
      buyer_email: transaction.buyer_email,
      buyer_first_name: transaction.buyer_first_name || null,
      buyer_last_name: transaction.buyer_last_name || null,
      order_date: transaction.transaction_date || new Date().toISOString(),
      status: transaction.status === 'Erfolgreich' || transaction.status === 'successful' ? 'paid' : 'pending',
      ablefy_product_id: transaction.product_id?.toString() || null,
      source: transaction.source_platform || 'ablefy',
      account_type: transaction.account_type || 'new',
      currency: 'EUR',
      imported_from_ablefy: false,
    }

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      // If duplicate key error, order was created in the meantime
      if (orderError.code === '23505') {
        console.log('Order created concurrently, fetching...')
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
        
        return new Response(
          JSON.stringify({ message: 'Order created concurrently' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
      throw orderError
    }

    console.log('Order created:', newOrder.id)

    // Link transaction to order
    await supabase
      .from('transactions')
      .update({ order_id: newOrder.id })
      .eq('trx_id', transaction.trx_id)

    // Map course if product_id exists
    if (transaction.product_id) {
      const { data: mapping } = await supabase
        .from('course_mapping')
        .select('course_id')
        .eq('ablefy_product_id', transaction.product_id.toString())
        .eq('is_active', true)
        .single()

      if (mapping) {
        console.log('Mapping course:', mapping.course_id)
        
        // Update both transaction and order
        await supabase
          .from('transactions')
          .update({ course_id: mapping.course_id })
          .eq('trx_id', transaction.trx_id)

        await supabase
          .from('orders')
          .update({ course_id: mapping.course_id })
          .eq('id', newOrder.id)
      }
    }

    // Calculate order totals from all transactions with same order_number
    const { data: allTransactions } = await supabase
      .from('transactions')
      .select('bezahlt, fees_total')
      .eq('order_number', transaction.order_number)

    if (allTransactions && allTransactions.length > 0) {
      const totalGross = allTransactions.reduce((sum, t) => sum + (parseFloat(t.bezahlt as any) || 0), 0)
      const totalFees = allTransactions.reduce((sum, t) => sum + (parseFloat(t.fees_total as any) || 0), 0)

      await supabase
        .from('orders')
        .update({
          amount_gross: totalGross,
          fees_total: totalFees,
          amount_minus_fees: totalGross - totalFees,
          transactions_count: allTransactions.length
        })
        .eq('id', newOrder.id)
    }

    // Try to link to user if exists
    const { data: user } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', transaction.buyer_email.toLowerCase())
      .single()

    if (user) {
      await supabase
        .from('transactions')
        .update({ user_id: user.id })
        .eq('trx_id', transaction.trx_id)

      await supabase
        .from('orders')
        .update({ user_id: user.id })
        .eq('id', newOrder.id)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        order_id: newOrder.id,
        message: 'Order created and linked successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
