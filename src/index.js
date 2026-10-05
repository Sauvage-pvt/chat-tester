export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (url.pathname === '/chat-tester' && request.method === 'GET') {
      const bedrift = url.searchParams.get('bedrift');
      const targetUrl = url.searchParams.get('url');

      if (!bedrift || !targetUrl) {
        return new Response(JSON.stringify({ error: 'Mangler bedrift eller url' }), { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      try {
        const response = await fetch(targetUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        const html = await response.text();

        // Telefon (norsk format)
        const telMatch = html.match(/(\d{2}\s?\d{2}\s?\d{2}\s?\d{2}|\d{8})/);
        const telefon = telMatch ? telMatch[0] : '';

        // Email
        const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const email = emailMatch ? emailMatch[0] : '';

        // Tjenester fra h2, h3
        const tjenester = [];
        const h2h3Match = html.match(/<h[23][^>]*>([^<]{3,80})<\/h[23]>/gi);
        if (h2h3Match) {
          h2h3Match.slice(0, 8).forEach(m => {
            const text = m.replace(/<[^>]*>/g, '').trim();
            if (text && !text.includes('http') && text.length > 3) {
              tjenester.push(text);
            }
          });
        }

        return new Response(JSON.stringify({ 
          success: true,
          bedrift,
          data: {
            tjenester: [...new Set(tjenester)],
            telefon,
            email,
            aapningstider: ''
          }
        }), { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          success: false,
          error: error.message 
        }), { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};
