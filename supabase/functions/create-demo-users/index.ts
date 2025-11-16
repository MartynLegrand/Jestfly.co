
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const { adminSecret } = await req.json()
    
    // Simple security check - require an admin secret
    if (adminSecret !== Deno.env.get('ADMIN_SECRET')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Define users to create
    const usersToCreate = [
      { email: 'admin@jestfly.com', password: '4b456b9c-5716-43ae-b55e-eb0475b81574', profile_type: 'admin' },
      { email: 'collaborator@jestfly.com', password: '4b456b9c-5716-43ae-b55e-eb0475b81574', profile_type: 'collaborator' },
      { email: 'fan@jestfly.com', password: '4b456b9c-5716-43ae-b55e-eb0475b81574', profile_type: 'fan' },
      { email: 'admin_demo@jestfly.com', password: 'Lns8955@$%', profile_type: 'admin' }
    ]

    const results = []

    // Create each user
    for (const user of usersToCreate) {
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          display_name: user.email.split('@')[0],
          username: user.email.split('@')[0],
          profile_type: user.profile_type
        }
      })

      if (createError) {
        results.push({ email: user.email, success: false, error: createError.message })
      } else {
        results.push({ email: user.email, success: true, user_id: userData.user.id })
      }
    }

    // Make saintgang@gmail.com an admin
    const saintgangEmail = 'saintgangltda@gmail.com'
    const { data: saintgangUser, error: saintgangFetchError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', saintgangEmail)
      .single()

    if (saintgangFetchError) {
      results.push({ email: saintgangEmail, success: false, error: saintgangFetchError.message })
    } else if (saintgangUser) {
      // Update the profile type to admin
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ profile_type: 'admin' })
        .eq('id', saintgangUser.id)

      if (updateError) {
        results.push({ email: saintgangEmail, success: false, error: updateError.message })
      } else {
        results.push({ email: saintgangEmail, success: true, message: 'Updated to admin' })
      }
    } else {
      results.push({ email: saintgangEmail, success: false, error: 'User not found' })
    }

    return new Response(
      JSON.stringify({ results }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
