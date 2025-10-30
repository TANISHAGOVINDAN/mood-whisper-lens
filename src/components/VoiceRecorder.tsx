import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Square, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VoiceRecorderProps {
  onTranscriptReady: (transcript: string) => void;
  onClose: () => void;
}

const VoiceRecorder = ({ onTranscriptReady, onClose }: VoiceRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setProcessing(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error('Failed to convert audio');
        }

        const { data, error } = await supabase.functions.invoke('voice', {
          body: { audio: base64Audio }
        });

        if (error) throw error;
        
        if (data?.text) {
          onTranscriptReady(data.text);
          toast.success('Transcription complete!');
        } else {
          throw new Error('No transcription received');
        }
      };
    } catch (error: any) {
      console.error('Error processing audio:', error);
      toast.error(error.message || 'Failed to transcribe audio');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="p-6 space-y-4 bg-accent/5">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
          {recording ? (
            <div className="w-4 h-4 bg-destructive rounded-full animate-pulse" />
          ) : processing ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <Mic className="w-8 h-8 text-primary" />
          )}
        </div>
        
        <div>
          <h4 className="font-semibold mb-1">
            {recording ? 'Recording...' : processing ? 'Transcribing...' : 'Ready to record'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {recording 
              ? 'Speak naturally and clearly' 
              : processing 
              ? 'Processing your voice input'
              : 'Click the button to start recording'}
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          {!recording && !processing && (
            <Button onClick={startRecording} size="lg" className="px-8">
              <Mic className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          )}
          
          {recording && (
            <Button onClick={stopRecording} variant="destructive" size="lg" className="px-8">
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          )}

          {!recording && !processing && (
            <Button onClick={onClose} variant="outline" size="lg">
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VoiceRecorder;
