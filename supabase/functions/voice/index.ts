import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { audio } = await req.json();
    console.log('Received voice transcription request');

    if (!audio) {
      throw new Error('No audio data provided');
    }

    const mockTranscript = "This is a demo transcription. In production, this would use the Whisper API to convert your speech to text. You can type your journal entry manually or enable voice transcription with an API key.";

    console.log('Returning mock transcript');

    return new Response(
      JSON.stringify({ text: mockTranscript }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in voice function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
