import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const demoEntries = [
  {
    text: "Today was overwhelming. I have so many deadlines piling up and I can't seem to focus on anything. My mind keeps racing from one task to another.",
    dominant_emotion: "anxious",
    emotion_scores: {
      happy: 0.05,
      excited: 0.0,
      neutral: 0.15,
      anxious: 0.65,
      sad: 0.10,
      angry: 0.05
    },
    reflection_text: "I notice you're feeling overwhelmed by multiple demands on your attention. It's completely normal to feel anxious when facing many tasks at once. Remember that you can only do one thing at a time.",
    suggestions: [
      "Try a 3-minute breathing exercise to calm your mind",
      "Write down all your tasks and prioritize the top 3",
      "Take a 10-minute walk to reset your focus"
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString()
  },
  {
    text: "Had a great conversation with an old friend today. We laughed so much! It reminded me how important it is to stay connected.",
    dominant_emotion: "happy",
    emotion_scores: {
      happy: 0.75,
      excited: 0.15,
      neutral: 0.05,
      anxious: 0.02,
      sad: 0.01,
      angry: 0.02
    },
    reflection_text: "It's wonderful that you took time to nurture a meaningful connection. Laughter and friendship are powerful sources of joy and wellbeing.",
    suggestions: [
      "Schedule regular catch-ups with people who lift your spirits",
      "Write a thank-you message to your friend",
      "Reflect on what makes this friendship special"
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
  },
  {
    text: "Feeling a bit down today. Not sure why exactly, just a general sense of sadness. Maybe it's the weather or just one of those days.",
    dominant_emotion: "sad",
    emotion_scores: {
      happy: 0.05,
      excited: 0.0,
      neutral: 0.20,
      anxious: 0.15,
      sad: 0.55,
      angry: 0.05
    },
    reflection_text: "Sometimes we feel sad without a clear reason, and that's okay. Acknowledging these feelings rather than pushing them away is an act of self-compassion.",
    suggestions: [
      "Do something small that usually brings you comfort",
      "Reach out to someone you trust",
      "Be gentle with yourself today"
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    text: "Just finished a project I've been working on for weeks! Feeling proud and accomplished. Ready to take on the next challenge!",
    dominant_emotion: "excited",
    emotion_scores: {
      happy: 0.40,
      excited: 0.50,
      neutral: 0.05,
      anxious: 0.03,
      sad: 0.01,
      angry: 0.01
    },
    reflection_text: "Congratulations on completing your project! Your sense of accomplishment is well-earned. This is a great moment to acknowledge your hard work and dedication.",
    suggestions: [
      "Celebrate this achievement in a way that feels meaningful to you",
      "Reflect on what you learned during this project",
      "Take a brief rest before your next challenge"
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  },
  {
    text: "Practicing gratitude today. Grateful for my health, my family, and the simple pleasure of morning coffee in a quiet house.",
    dominant_emotion: "neutral",
    emotion_scores: {
      happy: 0.35,
      excited: 0.05,
      neutral: 0.50,
      anxious: 0.05,
      sad: 0.03,
      angry: 0.02
    },
    reflection_text: "Your practice of gratitude is a powerful tool for wellbeing. Finding joy in simple moments is a sign of mindfulness and presence.",
    suggestions: [
      "Continue your gratitude practice daily",
      "Share something you're grateful for with someone close",
      "Take a photo of something beautiful you notice today"
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  }
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Demo data requested');

    return new Response(
      JSON.stringify({ entries: demoEntries }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in demo function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
