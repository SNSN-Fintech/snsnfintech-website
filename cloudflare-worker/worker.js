/**
 * SNSN Fintech - Web3Forms Proxy Worker
 *
 * This Cloudflare Worker sits between the frontend form and Web3Forms API.
 * The actual Web3Forms access key is stored as a Worker Secret (never in the browser).
 *
 * Deploy steps:
 * 1. Install Wrangler: npm install -g wrangler
 * 2. Login: wrangler login
 * 3. Set secret: wrangler secret put WEB3FORMS_KEY
 *    (enter the key when prompted)
 * 4. Deploy: wrangler deploy
 * 5. Update VITE_FORM_ENDPOINT in your .env to the Worker URL
 */

const ALLOWED_ORIGIN = 'https://snsnfintech.com.au'
const ALLOWED_ORIGIN_WWW = 'https://www.snsnfintech.com.au'

function corsHeaders(origin) {
  const allowed = origin === ALLOWED_ORIGIN || origin === ALLOWED_ORIGIN_WWW
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      })
    }

    try {
      const body = await request.json()

      // Basic validation
      if (!body.name || !body.email || !body.message) {
        return new Response(JSON.stringify({ success: false, message: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
        })
      }

      // Forward to Web3Forms with the secret key (never exposed to browser)
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: env.WEB3FORMS_KEY,    // stored as Worker Secret, never in source
          subject: `New Mortgage Broker Enquiry from ${body.name}`,
          from_name: 'SNSN Fintech Website',
          name: body.name,
          email: body.email,
          phone: body.phone || '',
          service: body.service || '',
          message: body.message,
        }),
      })

      const result = await response.json()

      return new Response(JSON.stringify(result), {
        status: response.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      })
    } catch (err) {
      return new Response(JSON.stringify({ success: false, message: 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      })
    }
  },
}
