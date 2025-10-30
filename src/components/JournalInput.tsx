import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Send, Loader2 } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

interface JournalInputProps {
  onSubmit: (text: string, isVoice?: boolean) => void;
  loading?: boolean;
}

const moodTags = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Anxious', emoji: '😰' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Excited', emoji: '🎉' },
  { label: 'Calm', emoji: '😌' },
  { label: 'Overwhelmed', emoji: '😵' },
];

const JournalInput = ({ onSubmit, loading }: JournalInputProps) => {
  const [text, setText] = useState('');
  const [showVoice, setShowVoice] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const isValid = text.trim().length > 0;

  const handleSubmit = () => {
    if (isValid && !loading) {
      onSubmit(text);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setText(transcript);
    setShowVoice(false);
  };

  const addMoodTag = (mood: string) => {
    setText(prev => prev ? `${prev} #${mood}` : `#${mood}`);
  };

  return (
    <Card className="p-6 space-y-4 shadow-lg">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">How are you feeling today?</h3>
          <span className="text-sm text-muted-foreground">{wordCount} words</span>
        </div>
        
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Express your thoughts and feelings freely... You're in a safe space."
          className="min-h-[150px] resize-none text-base"
          disabled={loading}
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {moodTags.map((tag) => (
            <Badge
              key={tag.label}
              variant="outline"
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => addMoodTag(tag.label)}
            >
              <span className="mr-1">{tag.emoji}</span>
              {tag.label}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowVoice(!showVoice)}
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={loading}
          >
            <Mic className="w-4 h-4 mr-2" />
            Voice Input
          </Button>
          
          <Button
            onClick={handleSubmit}
            size="lg"
            className="flex-1"
            disabled={!isValid || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Reflect
              </>
            )}
          </Button>
        </div>
      </div>

      {showVoice && (
        <VoiceRecorder
          onTranscriptReady={handleVoiceTranscript}
          onClose={() => setShowVoice(false)}
        />
      )}
    </Card>
  );
};

export default JournalInput;
