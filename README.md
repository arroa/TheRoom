# TheRoom - AI C-Suite Simulator

An immersive AI-powered boardroom experience where you, as CEO, convene with your C-Level executives for strategic discussions.

## 🎯 Features

- **Dynamic Executive Summoning**: AI orchestrator analyzes your topic and convenes only the relevant executives
- **Visual Board Table**: Executives appear/disappear dynamically with smooth animations
- **Real-time Debate**: Watch executives discuss, debate, and provide insights in real-time
- **Simplified Onboarding**: Get to the boardroom in seconds with a quick 3-field form

## 🏗️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **AI**: OpenAI GPT-4o-mini

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API Key
- Clerk Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/arroa/TheRoom.git
cd TheRoom
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_INACTIVITY_TIMEOUT_MINUTES=30
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🎭 The Executives

- **Victoria Chen** (CFO) - Financial strategy and risk management
- **Marcus Rodriguez** (CTO) - Technology architecture and innovation
- **Sarah Kim** (CIO) - Data governance and enterprise systems
- **James Foster** (CDO) - Digital transformation and customer experience

## 📋 How It Works

1. **Present Your Topic**: As CEO, you present a strategic topic or question
2. **AI Orchestration**: The system analyzes your topic and determines which executives are relevant
3. **Executive Summoning**: Relevant executives appear at the board table with visual animations
4. **Dynamic Debate**: Executives discuss the topic, providing insights from their domain expertise
5. **Interactive Control**: You can interrupt, ask specific executives questions, or guide the conversation

## 🛠️ Project Structure

```
the-room/
├── src/
│   ├── app/
│   │   ├── boardroom/       # Main boardroom interface
│   │   ├── actions.ts       # Server actions
│   │   └── layout.tsx       # Root layout
│   ├── components/
│   │   ├── Onboarding.tsx   # Quick onboarding form
│   │   └── ui.tsx           # Reusable UI components
│   ├── lib/
│   │   ├── ai.ts            # AI orchestrator & agent logic
│   │   ├── agents.ts        # Executive persona definitions
│   │   └── store.ts         # Zustand state management
│   └── middleware.ts        # Clerk authentication
```

## 🎨 Design Philosophy

- **Immersive Experience**: Feel like you're in a real boardroom
- **Dynamic Presence**: Executives only appear when needed
- **Visual Clarity**: Clear indicators of who's speaking and who wants to speak
- **Minimal Friction**: Get to the boardroom in seconds, not minutes

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.
