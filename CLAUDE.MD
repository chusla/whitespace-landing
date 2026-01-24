# Whitespace Landing Page

## Project Overview

This is the landing page and marketing website for **Whitespace**, a meditation app that generates personalized meditation sessions using AI. The app provides adaptive meditations for sleep, focus, and calm, with each session generated specifically for the user's needs.

## Product Details

- **App Name**: Whitespace
- **Tagline**: Custom Sleep Focus
- **Core Value Proposition**: Meditation that adapts to you, not the other way around
- **Platform**: iOS (TestFlight) and Android (Google Play)
- **Pricing Model**: Credit-based system (12 free credits = 60+ minutes of content)
- **Company**: One2all 2026
- **Contact**: hello@trywhitespace.com

## Technology Stack

### Frontend
- **HTML/CSS**: Static site with custom styling
- **JavaScript**: Vanilla JS for interactivity
- **Special Libraries**:
  - `phosphene.js`: Visual effects for landing page
  - `analytics.js`: Analytics tracking
  - Vercel Speed Insights

### Backend
- **Platform**: Vercel (serverless functions)
- **Database**: Supabase (PostgreSQL)
- **Email Service**: Resend (for welcome emails and notifications)
- **API**: Serverless functions in `/api` directory

### Build & Deployment
- **Hosting**: Vercel
- **Node Version**: >=18
- **Package Manager**: npm

## Project Structure

```
whitespace-landing/
├── index.html              # Main landing page
├── privacy.html            # Privacy policy
├── terms.html             # Terms of service
├── welcome.html           # Welcome page
├── api/
│   ├── subscribe.js       # Waitlist signup endpoint (Vercel serverless)
│   └── generate-welcome.js # Welcome email generation
├── assets/
│   └── js/
│       ├── phosphene.js   # Visual effects
│       └── analytics.js   # Analytics tracking
├── blog/                  # Blog section
│   ├── index.html         # Blog homepage
│   ├── assets/
│   │   ├── blog.css       # Blog-specific styles
│   │   ├── blog-images/   # Blog images and thumbnails
│   │   └── js/
│   │       ├── header.js  # Blog header component
│   │       └── footer.js  # Blog footer component
│   └── [various blog posts].html
├── generate-images*.html   # Image generation tools for marketing
├── screenshot-generator.html # App screenshot generator
├── *-preview.html         # Feature preview pages
├── vercel.json            # Vercel deployment config
├── package.json           # Dependencies
└── .env.example           # Environment variables template
```

## Key Features

### 1. Waitlist Signup System
- **Location**: `api/subscribe.js`
- **Features**:
  - Bot detection (honeypot fields, name validation, pattern detection)
  - Email validation
  - Duplicate prevention
  - Integration with Supabase for data storage
  - Resend integration for welcome emails and admin notifications
  - CORS support

### 2. Blog Section
- Multiple blog posts about meditation, neuroscience, and productivity
- Topics include:
  - Best meditation apps 2026
  - Brain rewiring and neuroplasticity
  - Focus and productivity
  - Sleep science
  - Meditation techniques (loving-kindness, somatic, etc.)
- Shared header/footer components via JavaScript
- Custom blog styling
- Twitter card images for social sharing

### 3. Marketing Tools
- Image generation utilities (`generate-images*.html`)
- Screenshot generator for app previews
- Feature preview pages (elevate, flow, immerse)
- 10x visualization tool

## Environment Variables

Required environment variables (see `.env.example`):
- `RESEND_API_KEY`: API key for Resend email service
- `RESEND_AUDIENCE_ID`: Resend audience ID for contact management
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `ADMIN_EMAIL`: Email for admin notifications (default: hello@trywhitespace.com)

## Database Schema

### Supabase `waitlist` Table
```sql
{
  email: string (unique, lowercase, trimmed),
  name: string (trimmed),
  created_at: timestamp
}
```

## API Endpoints

### POST /api/subscribe
Handles waitlist signup.

**Request Body**:
```json
{
  "email": "user@example.com",
  "name": "First Name",
  "website": "",  // Honeypot field
  "company": ""   // Honeypot field
}
```

**Bot Detection Features**:
- Honeypot fields (website, company)
- Name validation (length, character patterns, vowel presence)
- Gibberish detection (repeating patterns, consonant clusters)
- Case pattern analysis
- Letter frequency analysis

**Response**:
```json
{
  "success": true,
  "message": "Optional message"
}
```

**Side Effects**:
1. Saves email/name to Supabase
2. Adds contact to Resend audience
3. Sends welcome email with app download links
4. Sends admin notification email

## Deployment

### Vercel Configuration
- Serverless function memory: 1024 MB
- Max duration: 10 seconds
- URL rewrites for clean URLs (/privacy, /terms)

### Deploy Command
```bash
npm run deploy  # Runs: vercel --prod
```

### Branch Strategy
- Development branch: `claude/update-claude-md-c5ID3`
- All changes should be committed and pushed to this branch
- Push command: `git push -u origin claude/update-claude-md-c5ID3`

## Development Workflow

1. Make changes locally
2. Test locally (static site can be served with any HTTP server)
3. Commit changes with descriptive messages
4. Push to development branch
5. Deploy to Vercel for production

## Important Notes

### Security
- Bot detection is "silent" - returns success even when rejecting submissions
- Honeypot fields must remain empty for legitimate submissions
- All emails are normalized (lowercase, trimmed)
- Duplicate email submissions return success message

### Error Handling
- Graceful degradation: If email sending fails, user is still saved to database
- Audience addition failures don't break the signup flow
- Console warnings for missing environment variables

### Email Templates
- Welcome email includes app download badges (TestFlight, Google Play)
- 12 free credits mentioned prominently
- Personal message from Andrew (founder)
- Unsubscribe link included
- Admin notifications include signup details and timestamp

## Blog Content Strategy

The blog focuses on:
- Meditation science and neuroscience
- Practical meditation techniques
- App comparisons and reviews
- Mental health and productivity
- Sleep optimization

All blog images have both full-size and thumbnail versions, plus Twitter card images for social sharing.

## Recent Changes

Based on git history, recent work includes:
- Screen generation improvements
- Icon updates
- Additional social media content (tweets)
- Blog content expansion
