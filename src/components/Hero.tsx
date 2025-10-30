import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-wellness-lavender/20 via-wellness-blue/20 to-wellness-mint/20">
      <div className="max-w-4xl mx-auto text-center space-y-8 py-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Emotional Wellness</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Mental Wellness
            <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Mirror
            </span>
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your personal AI companion for emotional reflection. 
          Journal your feelings, receive empathetic insights, and track your wellness journey.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            onClick={() => navigate('/auth')}
          >
            <Heart className="w-5 h-5 mr-2" />
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6 rounded-xl"
            onClick={() => navigate('/auth?mode=demo')}
          >
            Try Demo
          </Button>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Reflection</h3>
            <p className="text-muted-foreground">
              Receive empathetic, personalized insights powered by advanced AI
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Emotion Tracking</h3>
            <p className="text-muted-foreground">
              Visualize your emotional patterns and wellness trends over time
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Voice Journaling</h3>
            <p className="text-muted-foreground">
              Speak your thoughts naturally with voice-to-text transcription
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground pt-8">
          Your privacy matters. All data is stored securely and never shared.
        </p>
      </div>
    </div>
  );
};

export default Hero;
