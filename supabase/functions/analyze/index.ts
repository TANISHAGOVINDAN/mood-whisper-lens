import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    console.log('Analyzing text:', text?.substring(0, 100));

    if (!text || typeof text !== 'string') {
      throw new Error('Text is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Call Lovable AI for emotion analysis and reflection
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a gentle, empathetic mental wellness assistant for journaling. Analyze the emotional tone of journal entries and provide supportive reflections.

Your response must be a valid JSON object with this exact structure:
{
  "dominant_emotion": "one of: happy, excited, neutral, anxious, sad, angry",
  "emotion_scores": {
    "happy": 0.0-1.0,
    "excited": 0.0-1.0,
    "neutral": 0.0-1.0,
    "anxious": 0.0-1.0,
    "sad": 0.0-1.0,
    "angry": 0.0-1.0
  },
  "reflection_text": "1-3 empathetic sentences acknowledging their feelings",
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2"],
  "safety": {
    "flags": [],
    "recommended_action": null
  }
}

Guidelines:
- Be warm, non-judgmental, and validating
- Suggestions should be simple (breathing exercise, short walk, self-care break)
- If severe distress is detected, set safety.recommended_action to "show_resources"
- Never provide clinical diagnosis
- Keep reflection brief and supportive`
          },
          {
            role: 'user',
            content: `Please analyze this journal entry and respond with ONLY a JSON object:\n\n${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', data);

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    let analysis;
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || 
                       content.match(/(\{[\s\S]*\})/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Fallback response
      analysis = {
        dominant_emotion: 'neutral',
        emotion_scores: {
          happy: 0.1,
          excited: 0.1,
          neutral: 0.6,
          anxious: 0.1,
          sad: 0.05,
          angry: 0.05
        },
        reflection_text: 'Thank you for sharing your thoughts. Taking time to reflect is an important step in understanding yourself better.',
        suggestions: [
          'Take a few deep breaths',
          'Go for a short walk'
        ],
        safety: {
          flags: [],
          recommended_action: null
        }
      };
    }

    console.log('Analysis result:', analysis);

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in analyze function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
