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
    const { text } = await req.json();
    console.log('Analyzing text:', text?.substring(0, 100));

    if (!text || typeof text !== 'string') {
      throw new Error('Text is required');
    }

    const wordCount = text.split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    const positiveWords = ['happy', 'joy', 'excited', 'great', 'amazing', 'wonderful', 'love', 'beautiful', 'perfect', 'blessed', 'grateful'];
    const anxiousWords = ['worried', 'anxious', 'nervous', 'stress', 'overwhelm', 'pressure', 'fear', 'scared'];
    const sadWords = ['sad', 'depressed', 'lonely', 'hurt', 'pain', 'cry', 'miss', 'loss', 'empty'];
    const angryWords = ['angry', 'frustrated', 'annoyed', 'mad', 'furious', 'irritated', 'hate'];

    const lowerText = text.toLowerCase();

    const happyScore = positiveWords.filter(w => lowerText.includes(w)).length / 10;
    const anxiousScore = anxiousWords.filter(w => lowerText.includes(w)).length / 8;
    const sadScore = sadWords.filter(w => lowerText.includes(w)).length / 9;
    const angryScore = angryWords.filter(w => lowerText.includes(w)).length / 7;
    const neutralScore = Math.max(0, 1 - (happyScore + anxiousScore + sadScore + angryScore));

    const emotions = {
      happy: Math.min(happyScore, 1),
      excited: Math.min(happyScore * 0.8, 1),
      neutral: Math.min(neutralScore, 1),
      anxious: Math.min(anxiousScore, 1),
      sad: Math.min(sadScore, 1),
      angry: Math.min(angryScore, 1)
    };

    const dominantEmotion = Object.entries(emotions).sort(([, a], [, b]) => b - a)[0][0];

    const reflections: Record<string, string> = {
      happy: "It's wonderful to see you feeling positive! Keep embracing these moments of joy.",
      excited: "Your enthusiasm is contagious! It's great to see you looking forward to things.",
      neutral: "Thank you for taking time to reflect. Sometimes processing our thoughts helps us understand ourselves better.",
      anxious: "I hear that you're feeling stressed. Remember, it's okay to feel this way, and these feelings will pass.",
      sad: "I'm here with you in this difficult moment. Your feelings are valid, and it's okay to take time to process them.",
      angry: "It sounds like you're going through something frustrating. Acknowledging these feelings is an important step."
    };

    const suggestionsByEmotion: Record<string, string[]> = {
      happy: ["Capture this moment with a photo or note", "Share your positivity with someone you care about"],
      excited: ["Channel this energy into a creative project", "Plan something you're looking forward to"],
      neutral: ["Try a mindfulness exercise", "Take a short walk outside"],
      anxious: ["Practice deep breathing for 5 minutes", "Write down what's worrying you", "Try progressive muscle relaxation"],
      sad: ["Reach out to a trusted friend", "Do something nurturing for yourself", "Allow yourself to feel without judgment"],
      angry: ["Take a break and step away from the situation", "Try physical activity to release tension", "Write freely about what upset you"]
    };

    const analysis = {
      dominant_emotion: dominantEmotion,
      emotion_scores: emotions,
      reflection_text: reflections[dominantEmotion],
      suggestions: suggestionsByEmotion[dominantEmotion] || suggestionsByEmotion.neutral,
      safety: {
        flags: [],
        recommended_action: null
      }
    };

    console.log('Analysis result:', analysis);

    return new Response(
      JSON.stringify(analysis),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in analyze function:', error);
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
