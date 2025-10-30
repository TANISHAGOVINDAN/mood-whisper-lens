import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Heart, Lightbulb, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ReflectionData {
  dominant_emotion: string;
  emotion_scores: Record<string, number>;
  reflection_text: string;
  suggestions: string[];
}

interface ReflectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reflection: ReflectionData | null;
  onSave: () => void;
  onDiscard: () => void;
}

const emotionColors: Record<string, string> = {
  happy: 'bg-secondary',
  excited: 'bg-accent',
  neutral: 'bg-muted',
  anxious: 'bg-primary',
  sad: 'bg-primary/70',
  angry: 'bg-destructive',
};

const ReflectionModal = ({
  open,
  onOpenChange,
  reflection,
  onSave,
  onDiscard,
}: ReflectionModalProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    if (open && reflection && speechSynthesis) {
      speakReflection();
    }
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [open, reflection]);

  const speakReflection = () => {
    if (!speechSynthesis || !reflection) return;

    speechSynthesis.cancel();

    const textToSpeak = `${reflection.reflection_text}. Suggested actions: ${reflection.suggestions.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    if (!speechSynthesis) return;

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakReflection();
    }
  };

  if (!reflection) return null;

  const emotionEntries = Object.entries(reflection.emotion_scores || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Your Reflection
            </div>
            {speechSynthesis && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSpeech}
                className="h-8 w-8"
              >
                {isSpeaking ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            Here's what we noticed about your emotional state
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Emotions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              <h4 className="font-semibold">Detected Emotions</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {emotionEntries.map(([emotion, score]) => (
                <Badge
                  key={emotion}
                  variant="secondary"
                  className={`${emotionColors[emotion] || 'bg-muted'} capitalize px-3 py-1`}
                >
                  {emotion} ({Math.round(score * 100)}%)
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Reflection Text */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h4 className="font-semibold">AI Reflection</h4>
            </div>
            <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
              {reflection.reflection_text}
            </p>
          </div>

          {/* Suggestions */}
          {reflection.suggestions && reflection.suggestions.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-secondary" />
                  <h4 className="font-semibold">Suggested Actions</h4>
                </div>
                <ul className="space-y-2">
                  {reflection.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onDiscard} className="w-full sm:w-auto">
            Discard
          </Button>
          <Button onClick={onSave} className="w-full sm:w-auto">
            Save Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReflectionModal;
