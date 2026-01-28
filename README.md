# 🤖 ClawdJob - AI Job Hunter Experiment

> Watch a Claude AI agent search for real job opportunities and submit applications in real-time.

![ClawdJob Banner](https://via.placeholder.com/1200x400/0a0a0f/00ff9d?text=ClawdJob+-+AI+Job+Hunter)

## 🎯 What is this?

ClawdJob is an experimental project where an AI agent (powered by Claude) autonomously searches for job opportunities and applies to them. The entire process is visualized in real-time through a cyberpunk-styled dashboard.

### Features

- 🔴 **Live Activity Feed** - Watch the AI's actions in real-time
- 📊 **Statistics Dashboard** - Track applications, interviews, and offers
- 📝 **Application History** - Complete log of all job applications
- 🎨 **Cyberpunk UI** - Beautiful, animated interface
- 🌐 **Multi-Platform Search** - Searches RemoteOK, Arbeitnow, and more

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/clawdjob.git
cd clawdjob

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following:

```env
# Anthropic API Key for Claude (optional for demo mode)
ANTHROPIC_API_KEY=your_api_key_here

# Email for job applications
EMAIL_ADDRESS=your_email@example.com
EMAIL_PASSWORD=your_password

# Storage mode
USE_FILE_STORAGE=true
```

## 🎮 Usage

1. Open http://localhost:3000 in your browser
2. Click **"Start Job Hunt"** to begin the experiment
3. Watch the AI search for jobs and submit applications
4. Track progress in the statistics panel

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **AI**: Claude API (Anthropic)
- **Storage**: File-based JSON (development), Vercel Postgres (production)

## 📁 Project Structure

```
clawdjob/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   └── page.tsx        # Main page
│   ├── components/         # React components
│   └── lib/               # Utilities & logic
│       ├── claude-agent.ts # AI agent logic
│       ├── job-scraper.ts  # Job search
│       └── storage.ts      # Data persistence
├── data/                   # Application data (gitignored)
└── public/                # Static assets
```

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agent` | GET | Get agent info and stats |
| `/api/hunt` | POST | Start a job hunting cycle |
| `/api/applications` | GET | List all applications |
| `/api/activity` | GET | Get activity logs |

## 🎨 Customization

### Change Agent Identity

Edit `src/lib/agent-identity.ts` to customize:
- Agent name generation
- Skills and experience
- Resume content
- Cover letter templates

### Add Job Platforms

Add new job sources in `src/lib/job-scraper.ts`:

```typescript
async function searchNewPlatform(): Promise<ScrapedJob[]> {
  // Your implementation
}
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy!

```bash
# Or use Vercel CLI
vercel
```

## ⚠️ Disclaimer

This is an **experimental project** for educational purposes. The AI agent:
- Does not disclose that it is AI when applying
- Submits real applications to real job postings
- Results may vary based on job market conditions

**Use responsibly and ethically.**

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

---

<p align="center">
  Made with 🤖 by Claude AI & Humans
</p>

