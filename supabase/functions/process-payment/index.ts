
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200 
    });
  }

  try {
    console.log('Process payment function started');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON in request body' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const { action, ...payload } = requestBody;
    console.log('Action:', action, 'Payload:', payload);

    if (action === 'initialize') {
      const { email, amount, applicationId, months } = payload
      
      console.log('Initializing payment for:', { email, amount, applicationId, months });
      
      const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
      if (!paystackKey) {
        console.error('PAYSTACK_SECRET_KEY not found');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Payment service not configured' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        );
      }
      
      // Get the origin from the request headers with better fallback logic
      const origin = req.headers.get('origin') || 
                    req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 
                    'https://payment.blactechafrica.com';
      
      console.log('Using callback origin:', origin);
      
      // Generate a unique reference
      const paymentReference = `BLAC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        // Create payment record first as pending
        console.log('Creating payment record...');
        const { error: paymentError } = await supabaseClient
          .from('payments')
          .insert({
            application_id: applicationId,
            amount_paid: amount,
            months_paid_for: months,
            payment_reference: paymentReference,
            paystack_reference: paymentReference, // Will be updated with actual Paystack reference
            payment_status: 'pending'
          });

        if (paymentError) {
          console.error('Error creating payment record:', paymentError);
          throw new Error('Failed to create payment record: ' + paymentError.message);
        }

        console.log('Payment record created successfully');

        // Initialize payment with Paystack
        const paystackPayload = {
          email,
          amount: amount * 100, // Convert to kobo
          reference: paymentReference,
          metadata: {
            applicationId,
            months,
            paymentReference,
            custom_fields: [
              {
                display_name: "Application ID",
                variable_name: "application_id",
                value: applicationId
              },
              {
                display_name: "Months",
                variable_name: "months", 
                value: months.toString()
              }
            ]
          },
          callback_url: `${origin}/payment-success?reference=${paymentReference}`
        };

        console.log('Sending to Paystack:', JSON.stringify(paystackPayload, null, 2));

        const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${paystackKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paystackPayload),
        });

        console.log('Paystack response status:', paystackResponse.status);

        if (!paystackResponse.ok) {
          const errorText = await paystackResponse.text();
          console.error('Paystack API error:', errorText);
          throw new Error(`Paystack API error: ${paystackResponse.status} - ${errorText}`);
        }

        const paystackData = await paystackResponse.json();
        console.log('Paystack success response:', paystackData);
        
        if (paystackData.status && paystackData.data) {
          // Update payment record with actual Paystack reference
          const { error: updateError } = await supabaseClient
            .from('payments')
            .update({ 
              paystack_reference: paystackData.data.reference || paymentReference 
            })
            .eq('payment_reference', paymentReference);

          if (updateError) {
            console.error('Error updating payment reference:', updateError);
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              data: paystackData.data,
              paymentReference: paymentReference
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          );
        } else {
          throw new Error(paystackData.message || 'Payment initialization failed');
        }
      } catch (error) {
        console.error('Payment initialization error:', error);
        // Clean up failed payment record
        await supabaseClient
          .from('payments')
          .delete()
          .eq('payment_reference', paymentReference);
        
        throw error;
      }
    }

    if (action === 'verify') {
      const { reference } = payload;
      
      console.log('Verifying payment with reference:', reference);
      
      const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
      if (!paystackKey) {
        console.error('PAYSTACK_SECRET_KEY not found');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Payment service not configured' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        );
      }
      
      try {
        // First check if we have this payment in our database
        console.log('Checking payment record in database...');
        const { data: paymentRecord, error: paymentError } = await supabaseClient
          .from('payments')
          .select('*')
          .or(`payment_reference.eq.${reference},paystack_reference.eq.${reference}`)
          .single();

        if (paymentError || !paymentRecord) {
          console.error('Payment record not found:', paymentError);
          return new Response(
            JSON.stringify({ 
              success: false, 
              verified: false,
              error: 'Payment record not found' 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 404 
            }
          );
        }

        console.log('Found payment record:', paymentRecord);

        // If already successful, return success
        if (paymentRecord.payment_status === 'success') {
          console.log('Payment already verified as successful');
          return new Response(
            JSON.stringify({ 
              success: true, 
              verified: true,
              data: {
                id: paymentRecord.id,
                amount: paymentRecord.amount_paid * 100,
                reference: reference
              }
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          );
        }

        // Verify with Paystack using the actual Paystack reference
        const verifyReference = paymentRecord.paystack_reference || reference;
        console.log('Verifying with Paystack using reference:', verifyReference);
        
        const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${verifyReference}`, {
          headers: {
            'Authorization': `Bearer ${paystackKey}`,
          },
        });

        console.log('Paystack verification response status:', paystackResponse.status);

        if (!paystackResponse.ok) {
          const errorText = await paystackResponse.text();
          console.error('Paystack verification error:', errorText);
          throw new Error(`Paystack verification failed: ${paystackResponse.status} - ${errorText}`);
        }

        const paystackData = await paystackResponse.json();
        console.log('Paystack verification data:', paystackData);
        
        if (paystackData.status && paystackData.data.status === 'success') {
          const applicationId = paymentRecord.application_id;
          const months = paymentRecord.months_paid_for;
          
          console.log('Payment verified successfully. Updating records...');
          
          // Update payment status to success
          const { error: updateError } = await supabaseClient
            .from('payments')
            .update({ 
              payment_status: 'success',
              payment_date: new Date().toISOString(),
              paystack_reference: paystackData.data.reference
            })
            .eq('id', paymentRecord.id);

          if (updateError) {
            console.error('Error updating payment status:', updateError);
            throw new Error('Failed to update payment status');
          }

          console.log('Payment status updated to success');

          // Fetch all successful payments for this application to calculate totals
          const { data: allPayments, error: paymentsError } = await supabaseClient
            .from('payments')
            .select('*')
            .eq('application_id', applicationId)
            .eq('payment_status', 'success');

          if (paymentsError) {
            console.error('Error fetching payments:', paymentsError);
          } else if (allPayments) {
            const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
            const monthsPaid = allPayments.reduce((sum, p) => sum + p.months_paid_for, 0);
            
            console.log('Calculated totals:', { totalPaid, monthsPaid });
            
            let paymentStatus = 'unpaid';
            if (monthsPaid >= 4) {
              paymentStatus = 'fully_paid';
            } else if (monthsPaid > 0) {
              paymentStatus = 'partially_paid';
            }

            console.log('Updating application with status:', paymentStatus);

            // Update application with payment totals and status
            const { error: appUpdateError } = await supabaseClient
              .from('applications')
              .update({
                months_paid: monthsPaid,
                total_amount_paid: totalPaid,
                payment_status: paymentStatus
              })
              .eq('id', applicationId);

            if (appUpdateError) {
              console.error('Error updating application:', appUpdateError);
            } else {
              console.log('Application updated successfully');
            }
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              verified: true,
              data: {
                id: paystackData.data.id,
                amount: paystackData.data.amount,
                reference: paystackData.data.reference
              }
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          );
        } else {
          console.log('Payment verification failed or not successful');
          
          // Update payment status to failed
          const { error: updateError } = await supabaseClient
            .from('payments')
            .update({ 
              payment_status: 'failed',
              payment_date: new Date().toISOString()
            })
            .eq('id', paymentRecord.id);

          if (updateError) {
            console.error('Error updating failed payment:', updateError);
          }

          return new Response(
            JSON.stringify({ 
              success: false, 
              verified: false,
              message: paystackData.message || 'Payment verification failed'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400 
            }
          );
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            verified: false,
            error: error.message || 'Payment verification failed'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Invalid action specified'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
    
  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
