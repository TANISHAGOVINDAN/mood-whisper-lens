import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Hero from '@/components/Hero';
import JournalInput from '@/components/JournalInput';
import ReflectionModal from '@/components/ReflectionModal';
import { Button } from '@/components/ui/button';

interface ReflectionData {
  dominant_emotion: string;
  emotion_scores: Record<string, number>;
  reflection_text: string;
  suggestions: string[];
}

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [reflection, setReflection] = useState<ReflectionData | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleAnalyze = async (text: string) => {
    setCurrentText(text);
    setAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze', {
        body: { text }
      });

      if (error) throw error;

      setReflection(data);
    } catch (error: any) {
      console.error('Error analyzing:', error);
      toast.error('Failed to analyze entry. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!user || !reflection) {
      toast.error('Please sign in to save entries');
      return;
    }

    try {
      const { error } = await supabase.from('entries').insert({
        user_id: user.id,
        text: currentText,
        dominant_emotion: reflection.dominant_emotion,
        emotion_scores: reflection.emotion_scores,
        reflection_text: reflection.reflection_text,
        suggestions: reflection.suggestions,
        timestamp: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success('Entry saved!');
      setReflection(null);
      setCurrentText('');
    } catch (error: any) {
      console.error('Error saving entry:', error);
      toast.error('Failed to save entry');
    }
  };

  const handleDiscardEntry = () => {
    setReflection(null);
    setCurrentText('');
  };

  const loadDemoData = async () => {
    if (!user) {
      toast.error('Please sign in to load demo data');
      return;
    }

    setLoadingDemo(true);
    try {
      const { data, error } = await supabase.functions.invoke('demo', {
        body: {}
      });

      if (error) throw error;

      // Insert demo entries
      const entries = data.entries.map((entry: any) => ({
        ...entry,
        user_id: user.id,
      }));

      const { error: insertError } = await supabase
        .from('entries')
        .insert(entries);

      if (insertError) throw insertError;

      toast.success('Demo data loaded! Check your dashboard.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error loading demo data:', error);
      toast.error('Failed to load demo data');
    } finally {
      setLoadingDemo(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Hero />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-lavender/10 via-wellness-blue/10 to-wellness-mint/10">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Journal Your Feelings</h1>
            <p className="text-muted-foreground">
              Express yourself freely and receive AI-powered insights
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadDemoData}
              disabled={loadingDemo}
            >
              {loadingDemo ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load Demo Data'
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>

        <JournalInput onSubmit={handleAnalyze} loading={analyzing} />

        <ReflectionModal
          open={!!reflection}
          onOpenChange={(open) => !open && setReflection(null)}
          reflection={reflection}
          onSave={handleSaveEntry}
          onDiscard={handleDiscardEntry}
        />
      </div>
    </div>
  );
};

export default Index;
