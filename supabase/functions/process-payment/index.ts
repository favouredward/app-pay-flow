
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ...payload } = await req.json()

    if (action === 'initialize') {
      const { email, amount, applicationId } = payload
      
      // Initialize payment with Paystack
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Convert to kobo
          metadata: {
            applicationId,
            custom_fields: [
              {
                display_name: "Application ID",
                variable_name: "application_id",
                value: applicationId
              }
            ]
          },
          callback_url: `${req.headers.get('origin')}/payment-success`
        }),
      })

      const paystackData = await response.json()
      
      if (paystackData.status) {
        // Create payment record
        const { error: paymentError } = await supabaseClient
          .from('payments')
          .insert({
            application_id: applicationId,
            amount_paid: amount,
            months_paid_for: 1,
            payment_reference: `PST_${Date.now()}`,
            paystack_reference: paystackData.data.reference,
            payment_status: 'pending'
          })

        if (paymentError) {
          console.error('Error creating payment record:', paymentError)
          throw new Error('Failed to create payment record')
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: paystackData.data 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      } else {
        throw new Error(paystackData.message || 'Payment initialization failed')
      }
    }

    if (action === 'verify') {
      const { reference } = payload
      
      // Verify payment with Paystack
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
        },
      })

      const paystackData = await response.json()
      
      if (paystackData.status && paystackData.data.status === 'success') {
        const applicationId = paystackData.data.metadata?.applicationId
        
        if (applicationId) {
          // Update payment status
          const { error: updateError } = await supabaseClient
            .from('payments')
            .update({ 
              payment_status: 'success',
              payment_date: new Date().toISOString()
            })
            .eq('paystack_reference', reference)

          if (updateError) {
            console.error('Error updating payment:', updateError)
          }
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            verified: true,
            data: paystackData.data 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            verified: false,
            message: 'Payment verification failed'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }
    }

    throw new Error('Invalid action')
    
  } catch (error) {
    console.error('Payment processing error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
