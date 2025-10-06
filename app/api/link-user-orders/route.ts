import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🔗 API Route called: /api/link-user-orders')

  try {
    const { userId, email } = await request.json()
    console.log('📧 Linking orders for:', email, 'User ID:', userId)

    if (!userId || !email) {
      console.log('❌ Missing userId or email')
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      )
    }

    // Create Supabase client with service role key (needed for UPDATE operations)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseServiceKey) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('🔍 Looking for orders with email:', email)

    // Link orders to user
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .update({ user_id: userId })
      .eq('buyer_email', email.toLowerCase())
      .is('user_id', null)
      .select('id, ablefy_order_number, course_id, status')

    if (ordersError) {
      console.error('❌ Error linking orders:', ordersError)
      return NextResponse.json(
        { error: 'Failed to link orders: ' + ordersError.message },
        { status: 500 }
      )
    }

    const ordersLinked = ordersData?.length || 0
    console.log(`✅ Linked ${ordersLinked} orders`)

    // Link transactions to user
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .update({ user_id: userId })
      .eq('buyer_email', email.toLowerCase())
      .is('user_id', null)
      .select('id')

    if (transactionsError) {
      console.error('⚠️ Error linking transactions (non-critical):', transactionsError)
      // Don't fail the request if transactions fail
    }

    const transactionsLinked = transactionsData?.length || 0
    console.log(`✅ Linked ${transactionsLinked} transactions`)

    // Get course info for linked orders
    const courseIds = ordersData
      ?.filter(o => o.course_id && o.status === 'paid')
      .map(o => o.course_id) || []

    const result = {
      success: true,
      ordersLinked,
      transactionsLinked,
      courseIds,
      message: ordersLinked > 0 
        ? `Successfully linked ${ordersLinked} orders and ${transactionsLinked} transactions`
        : 'No new orders to link (user already linked or no orders found)'
    }

    console.log('✨ Link result:', result)

    return NextResponse.json(result, { status: 200 })

  } catch (error: any) {
    console.error('💥 Error in link-user-orders:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error.message,
        success: false 
      },
      { status: 500 }
    )
  }
}

