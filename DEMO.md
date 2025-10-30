# Mental Wellness Mirror - Demo Guide

## Quick Start for Judges (60-90 seconds)

This guide provides a structured demo flow for hackathon presentations.

## Demo Credentials

**Guest Mode**: No credentials needed
- Click "Try Demo" or "Continue as Guest"

**Test Account** (Optional):
- Email: `demo@mentalwellness.app`
- Password: `Demo2024!`

## 60-Second Speed Demo

### Script

**[0-10s] Landing Page**
> "Mental Wellness Mirror is an AI-powered emotional reflection tool. Users journal their feelings and receive empathetic insights."

*Action*: Show hero page briefly, click "Try Demo"

---

**[10-25s] Journal Entry**
> "Here's a sample entry about feeling overwhelmed with deadlines."

*Action*: 
- Continue as guest
- Type or paste: "I'm feeling overwhelmed with deadlines and can't focus on anything. My mind keeps racing."
- Click "Reflect"
- Show AI reflection modal with:
  - Detected emotions
  - Empathetic reflection
  - Actionable suggestions

---

**[25-40s] Dashboard**
> "The dashboard tracks emotional patterns over time with sentiment trends and entry history."

*Action*:
- Click "Dashboard"
- Point to the 7-day wellness trend chart
- Highlight emotion badges on recent entries
- Show total entries and average sentiment

---

**[40-55s] Demo Data**
> "We can load sample data to see how the dashboard looks with multiple entries."

*Action*:
- Click "Load Demo Data"
- Show populated dashboard with 5+ entries
- Point out variety of emotions (happy, anxious, sad, excited)
- Highlight trend changes

---

**[55-65s] Privacy & Settings**
> "Privacy is core. Data is local by default, with optional cloud sync. Users can delete everything anytime."

*Action*:
- Navigate to Settings
- Show cloud sync toggle
- Point to "Delete All My Data" button

---

**[65-90s] Wrap Up & Q&A**
> "Key features: AI-powered reflections using Google Gemini, emotion tracking, voice input support, and privacy-first design. The tech stack is React, Tailwind, Lovable Cloud backend, with RLS security. Built mobile-first and fully accessible."

*Be ready for questions about*:
- AI model selection
- Privacy/security approach
- Scalability
- Future features

## 90-Second Extended Demo

Add these sections if you have extra time:

### Voice Input Demo [+15s]
*Action*:
- Click "Voice Input" button
- Explain: "Production would use Whisper API for real-time transcription"
- Show transcript appearing

### Analytics Deep Dive [+15s]
*Action*:
- Return to dashboard
- Explain sentiment score calculation
- Show how emotions map to colors
- Discuss trend patterns

## Common Judge Questions

**Q: How does the AI ensure user safety?**
> "We use content moderation checks and flag concerning content. If severe distress is detected, we recommend professional resources. We never diagnose or replace professional help."

**Q: How scalable is this?**
> "Built on Supabase/PostgreSQL with edge functions that auto-scale. RLS policies ensure data isolation. Currently handles thousands of users; could scale to millions with database sharding."

**Q: What about HIPAA compliance for real production?**
> "This is a wellness tool, not medical. For clinical use, we'd need: BAA with Supabase, enhanced encryption, audit logs, access controls, and PHI handling protocols."

**Q: Why not use real Whisper API in demo?**
> "Time constraints for hackathon. The architecture is ready - just needs API key and integration. Edge function structure is already there."

**Q: Differentiation from competitors?**
> "AI-powered reflections (not just tracking), privacy-first design, accessible UI, demo-friendly, and open-source architecture."

## Technical Talking Points

### Architecture
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Lovable Cloud (Supabase PostgreSQL)
- **AI**: Google Gemini 2.5 Flash via Lovable AI Gateway
- **Security**: Row Level Security, JWT auth, no API keys in client
- **Deployment**: Edge functions auto-scale, CDN-delivered frontend

### Design Decisions
- Pastel colors for calm, therapeutic feel
- Mobile-first responsive design
- WCAG 2.1 AA accessibility compliance
- 200ms micro-interactions for smooth UX
- Semantic HTML and ARIA labels

### Database Schema
- **profiles**: User metadata
- **entries**: Journal entries with emotion data
- **analytics**: Daily aggregated sentiment scores
- Triggers auto-update analytics on new entries

## Troubleshooting

**If demo doesn't load**:
- Refresh page
- Clear browser cache
- Use incognito mode
- Have backup screenshots ready

**If AI is slow**:
- Explain: "Live AI call - shows real latency"
- Have a pre-analyzed entry ready to show

**If guest mode has issues**:
- Use test account credentials
- Skip auth and demo from authenticated state

## Post-Demo

### GitHub Repository
Share the repo link with judges:
- README.md has full setup instructions
- DEMO.md (this file) for their reference
- Architecture diagrams in /docs folder

### Live Site
Deployed at: [Your deployment URL]

### Contact
- Email: [Your email]
- GitHub: [Your GitHub]
- Demo video: [YouTube/Loom link]

## Demo Data Details

The demo loads these 5 sample entries:

1. **Anxious** (6 days ago): Overwhelmed with deadlines
2. **Happy** (4 days ago): Great conversation with friend
3. **Sad** (3 days ago): Feeling down, no clear reason
4. **Excited** (1 day ago): Project completion success
5. **Neutral** (12 hours ago): Gratitude practice

This creates a varied emotional journey showing the app's versatility.

## Time Allocation Tips

- **30s demo**: Landing + 1 entry + dashboard overview
- **60s demo**: Full flow including settings
- **90s demo**: Add voice demo and analytics deep dive
- **2min demo**: Include technical architecture explanation

## Backup Plan

If live demo fails:
1. Have screen recording ready
2. Use screenshots in slide deck
3. Explain architecture verbally with diagrams

---

## Good Luck!

Remember to:
- Speak clearly and confidently
- Make eye contact with judges
- Show enthusiasm for the project
- Be ready for technical questions
- Emphasize user privacy and safety
- Highlight scalability and real-world applicability

Your 60-90 seconds can make a strong impression. Practice the flow 2-3 times before presenting.
