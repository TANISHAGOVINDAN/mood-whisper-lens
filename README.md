# Mental Wellness Mirror

A GenAI-powered emotional reflection prototype that helps users journal their feelings and receive empathetic AI insights.

## Overview

Mental Wellness Mirror is an emotional wellness application that combines journaling with AI-powered emotion analysis. Users can express their thoughts through text or voice, and receive personalized reflections, emotion tracking, and actionable wellness suggestions.

## Features

### 🎯 Core Functionality
- **AI-Powered Reflection**: Get empathetic insights powered by advanced AI models
- **Emotion Tracking**: Visualize emotional patterns with analytics dashboard
- **Voice Journaling**: Express thoughts naturally with voice-to-text (demo mode)
- **Demo Mode**: One-click demo with sample data for presentations

### 🔐 Authentication
- Email/password authentication
- Anonymous guest mode
- Automatic profile creation
- Cloud sync (optional)

### 📊 Dashboard
- 7-day wellness trend visualization
- Entry history with emotion badges
- Analytics: total entries, sentiment scores, mood patterns

### 🎨 Design
- Calm pastel color scheme (lavender, mint, pastel blue)
- Mobile-first responsive design
- Accessible (WCAG 2.1 AA compliant)
- Smooth micro-interactions

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **React Router** for navigation

### Backend (Lovable Cloud)
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Serverless Functions**: Edge Functions
- **AI**: Lovable AI Gateway (Google Gemini 2.5 Flash)

### Edge Functions
1. **`/analyze`**: Analyzes journal text for emotions and generates reflections
2. **`/voice`**: Speech-to-text transcription (demo mode)
3. **`/demo`**: Provides sample data for demonstrations

## Database Schema

### Tables
- `profiles`: User profile information
- `entries`: Journal entries with emotion data
- `analytics`: Aggregated daily sentiment data

### Key Features
- Row Level Security (RLS) on all tables
- Automatic profile creation on signup
- Real-time analytics updates via triggers

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:8080 in your browser

## Demo Script (60-90 seconds)

Perfect for hackathon judges and stakeholders:

1. **Landing Page** (10s)
   - Show hero with value proposition
   - Click "Try Demo"

2. **Guest Mode** (15s)
   - Continue as guest
   - Type: "I'm feeling overwhelmed with deadlines and can't focus"
   - Show AI reflection with suggestions

3. **Dashboard** (20s)
   - Navigate to dashboard
   - Show 7-day wellness trend
   - Point out emotion badges and analytics

4. **Demo Data** (15s)
   - Click "Load Demo Data"
   - Show populated dashboard with multiple entries
   - Highlight sentiment patterns

5. **Settings & Privacy** (15s)
   - Go to Settings
   - Show cloud sync option
   - Mention: "Local by default, sync only when enabled"

6. **Wrap Up** (15s)
   - Emphasize: AI-powered insights, privacy-first, accessible design
   - Mention voice input capability (future production feature)

## Environment Variables

The following environment variables are automatically configured:
- `VITE_SUPABASE_URL`: Backend URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Public API key
- `LOVABLE_API_KEY`: AI gateway key (server-side only)

## Privacy & Security

- **Local-first**: Entries stored locally by default
- **Optional sync**: Users opt-in to cloud sync
- **RLS policies**: Database access restricted per user
- **No API keys in client**: All AI calls via backend
- **Delete data**: Users can delete all their data

## Deployment

### Via Lovable
1. Click the "Publish" button in Lovable
2. Your app will be deployed automatically

### Via Vercel (Recommended)
```bash
npm run build
# Deploy the dist/ folder to Vercel
```

## Development

### Project Structure
```
src/
├── components/       # React components
│   ├── Hero.tsx
│   ├── JournalInput.tsx
│   ├── ReflectionModal.tsx
│   ├── Dashboard.tsx
│   └── VoiceRecorder.tsx
├── contexts/         # React contexts
│   └── AuthProvider.tsx
├── pages/           # Page components
│   ├── Index.tsx
│   ├── Auth.tsx
│   ├── DashboardPage.tsx
│   └── Settings.tsx
├── integrations/    # Backend integrations
│   └── supabase/
└── lib/            # Utility functions

supabase/
└── functions/      # Edge functions
    ├── analyze/
    ├── voice/
    └── demo/
```

### Key Design Decisions

1. **Design System**: All colors via HSL semantic tokens in `index.css`
2. **Authentication**: Complete session management with auto-redirect
3. **Error Handling**: Toast notifications for all user actions
4. **Loading States**: Skeleton loaders and spinners for better UX
5. **Accessibility**: ARIA labels, keyboard navigation, proper contrast

## API Integration

### Lovable AI Gateway
The app uses Lovable AI (Google Gemini 2.5 Flash) for:
- Emotion detection
- Empathetic reflection generation
- Suggestion creation
- Safety checks

All API calls happen server-side via edge functions.

## Limitations & Future Work

### Current Demo Limitations
- Voice transcription uses mock data (production would use Whisper API)
- No push notifications
- Single language support (English)

### Potential Enhancements
- Real-time collaboration
- Therapist/coach integration
- Mobile app (React Native)
- More AI models and customization
- Export data (PDF, CSV)
- Social features (optional, privacy-aware)

## Contributing

This is a hackathon prototype. For production use:
1. Add comprehensive error handling
2. Implement rate limiting
3. Add input validation (Zod schemas)
4. Set up monitoring (Sentry, LogRocket)
5. Add E2E tests (Playwright)
6. Implement real Whisper integration

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Create an issue in the GitHub repository
- Contact: [Your contact info]

## Acknowledgments

- Built with [Lovable](https://lovable.dev)
- AI powered by Google Gemini via Lovable AI
- UI components by shadcn/ui
- Icons by Lucide

---

**Note**: This is a demonstration prototype built for educational purposes. For production use with real users, additional security audits, privacy compliance (GDPR, HIPAA if applicable), and testing are required.
