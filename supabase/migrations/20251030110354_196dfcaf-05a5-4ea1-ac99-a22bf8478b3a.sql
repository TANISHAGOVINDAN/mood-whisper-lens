-- Create users profile extension table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  cloud_sync_enabled BOOLEAN DEFAULT false,
  provider TEXT DEFAULT 'email',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create entries table
CREATE TABLE public.entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  transcript TEXT,
  dominant_emotion TEXT,
  emotion_scores JSONB,
  reflection_text TEXT,
  suggestions TEXT[],
  timestamp TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- Entries policies
CREATE POLICY "Users can view own entries"
  ON public.entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own entries"
  ON public.entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON public.entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON public.entries FOR DELETE
  USING (auth.uid() = user_id);

-- Create analytics table for aggregated data
CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  avg_sentiment_score DECIMAL(3,2),
  dominant_emotion TEXT,
  entry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Analytics policies
CREATE POLICY "Users can view own analytics"
  ON public.analytics FOR SELECT
  USING (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update analytics
CREATE OR REPLACE FUNCTION public.update_daily_analytics()
RETURNS TRIGGER AS $$
DECLARE
  emotion_score DECIMAL(3,2);
BEGIN
  -- Calculate sentiment score from emotion (simplified)
  CASE NEW.dominant_emotion
    WHEN 'happy' THEN emotion_score := 0.90;
    WHEN 'excited' THEN emotion_score := 0.85;
    WHEN 'neutral' THEN emotion_score := 0.50;
    WHEN 'anxious' THEN emotion_score := 0.30;
    WHEN 'sad' THEN emotion_score := 0.20;
    WHEN 'angry' THEN emotion_score := 0.15;
    ELSE emotion_score := 0.50;
  END CASE;

  INSERT INTO public.analytics (user_id, date, avg_sentiment_score, dominant_emotion, entry_count)
  VALUES (NEW.user_id, DATE(NEW.timestamp), emotion_score, NEW.dominant_emotion, 1)
  ON CONFLICT (user_id, date) DO UPDATE SET
    avg_sentiment_score = (analytics.avg_sentiment_score * analytics.entry_count + emotion_score) / (analytics.entry_count + 1),
    entry_count = analytics.entry_count + 1,
    dominant_emotion = CASE 
      WHEN emotion_score > analytics.avg_sentiment_score THEN NEW.dominant_emotion
      ELSE analytics.dominant_emotion
    END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update analytics on new entry
CREATE TRIGGER on_entry_created
  AFTER INSERT ON public.entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_daily_analytics();