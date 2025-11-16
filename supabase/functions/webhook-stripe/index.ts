
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Stripe } from 'https://esm.sh/stripe@12.13.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Missing Stripe secret key');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the Stripe signature from headers
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('Missing Stripe signature');
    }

    // Get raw body for signature verification
    const body = await req.text();
    
    // Verify webhook signature
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!endpointSecret) {
      throw new Error('Missing webhook secret');
    }

    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(supabase, event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(supabase, event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    );
  }
});

async function handlePaymentIntentSucceeded(supabase, paymentIntent) {
  const { metadata } = paymentIntent;
  
  if (!metadata || !metadata.order_id) {
    console.log('No order ID in metadata');
    return;
  }

  const { order_id, customer_id } = metadata;

  try {
    // Update payment intent in database
    await supabase
      .from('payment_intents')
      .update({
        status: 'succeeded',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    // Update order status
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        updated_at: new Date().toISOString(),
        payment_details: {
          payment_id: paymentIntent.id,
          payment_method: 'stripe',
          amount_paid: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
        },
      })
      .eq('id', order_id);

    // Create a notification for the user
    await supabase
      .from('user_notifications')
      .insert({
        user_id: customer_id,
        title: 'Payment Successful',
        message: 'Your payment has been processed successfully. We are preparing your order.',
        type: 'order_update',
        reference_id: order_id,
        reference_type: 'order',
      });

    console.log(`Updated order ${order_id} status to paid`);
  } catch (error) {
    console.error('Error updating order status:', error);
  }
}

async function handlePaymentIntentFailed(supabase, paymentIntent) {
  const { metadata } = paymentIntent;
  
  if (!metadata || !metadata.order_id) {
    console.log('No order ID in metadata');
    return;
  }

  const { order_id, customer_id } = metadata;

  try {
    // Update payment intent in database
    await supabase
      .from('payment_intents')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    // Update order status
    await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
        payment_details: {
          payment_id: paymentIntent.id,
          payment_method: 'stripe',
          error: paymentIntent.last_payment_error?.message || 'Payment failed',
        },
      })
      .eq('id', order_id);

    // Create a notification for the user
    await supabase
      .from('user_notifications')
      .insert({
        user_id: customer_id,
        title: 'Payment Failed',
        message: 'Your payment could not be processed. Please try again or use a different payment method.',
        type: 'order_update',
        reference_id: order_id,
        reference_type: 'order',
      });

    console.log(`Updated order ${order_id} status to cancelled due to payment failure`);
  } catch (error) {
    console.error('Error updating order status:', error);
  }
}
