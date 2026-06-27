# Aaron's 3D AI Digital Twin Portfolio

A modern, interactive 3D portfolio website featuring an AI-powered "Digital Twin" chatbot and a secure contact system. Built with Next.js, React Three Fiber, and the Vercel AI SDK.

## 🚀 Features

- **Interactive 3D Environment:** Built with React Three Fiber (`@react-three/fiber`) and Drei, offering an immersive user experience.
- **AI Digital Twin:** An integrated, streaming AI chatbot powered by the Vercel AI SDK and OpenRouter. It acts as a digital twin to answer questions about skills and experience.
- **Secure Contact Form:** A direct-to-device contact pipeline using the Pushover API, complete with frontend state management and backend validation.
- **API Rate Limiting:** Custom in-memory LRU caching to strictly enforce rate limits (protecting both the LLM tokens and the contact form from spam).
- **Robust Test Suite:** Fully tested using Vitest and React Testing Library for components, API routes, and utilities.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **3D Graphics:** [Three.js](https://threejs.org/), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/docs), OpenRouter
- **Testing:** [Vitest](https://vitest.dev/), React Testing Library
- **Styling:** CSS Modules

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aaron-official/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy the example environment file and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
   **Required Variables:**
   - `OPENROUTER_API_KEY`: For the AI Digital Twin.
   - `PUSHOVER_USER`: Your Pushover user key.
   - `PUSHOVER_TOKEN`: Your Pushover application token.

4. Start the development server:
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:3000](http://localhost:3000).

## 🧪 Testing

The project uses Vitest for lightning-fast testing.

- Run all tests: `npm run test`
- Run tests with UI: `npm run test:ui`
- Generate coverage report: `npm run test:coverage`

## 📁 Project Structure

- `/src/app` - Next.js App Router pages and API endpoints (`/api/chat`, `/api/contact`).
- `/src/components` - React components (UI forms, 3D Canvas, Player, Scene).
- `/src/lib` - Utility functions (e.g., Rate Limiter).
- `/__tests__` - Isolated test suites for APIs, components, and utilities.
- `/public` - Static assets and 3D models.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
