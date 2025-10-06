// Auto-Link Orders to User on Login/Registration
// This edge function runs automatically when a user logs in or signs up
// It links all orders with matching email to the user

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  type: string
  table: string
  record: any
  schema: string
  old_record: any
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the webhook payload
    const payload: WebhookPayload = await req.json()
    
    console.log('🔐 Auto-Link Triggered:', payload.type)
    
    // Only process INSERT events (new user signup)
    if (payload.type !== 'INSERT') {
      return new Response(
        JSON.stringify({ message: 'Not an INSERT event, skipping' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = payload.record.id
    const userEmail = payload.record.email

    if (!userId || !userEmail) {
      throw new Error('Missing user ID or email')
    }

    console.log(`👤 Linking orders for user: ${userEmail} (${userId})`)

    // Link orders to user
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .update({ user_id: userId })
      .eq('buyer_email', userEmail.toLowerCase())
      .is('user_id', null)
      .select('id, ablefy_order_number, course_id')

    if (ordersError) {
      console.error('❌ Error linking orders:', ordersError)
      throw ordersError
    }

    const ordersLinked = ordersData?.length || 0
    console.log(`✅ Linked ${ordersLinked} orders`)

    // Link transactions to user
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .update({ user_id: userId })
      .eq('buyer_email', userEmail.toLowerCase())
      .is('user_id', null)
      .select('id')

    if (transactionsError) {
      console.error('❌ Error linking transactions:', transactionsError)
      // Don't throw, just log
    }

    const transactionsLinked = transactionsData?.length || 0
    console.log(`✅ Linked ${transactionsLinked} transactions`)

    // Get course IDs for welcome email or notification
    const courseIds = ordersData
      ?.filter(o => o.course_id)
      .map(o => o.course_id) || []

    const result = {
      success: true,
      userId,
      userEmail,
      ordersLinked,
      transactionsLinked,
      courseIds,
      message: ordersLinked > 0 
        ? `Successfully linked ${ordersLinked} orders and ${transactionsLinked} transactions`
        : 'No orders found to link'
    }

    console.log('✨ Auto-Link Complete:', result)

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('💥 Error in auto-link function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

