# Aaron's Portfolio

A fast landing page for Aaron Kakembo, with an optional 3D island and an AI "digital twin" that answers questions about his work. Built with Next.js, React Three Fiber and the Vercel AI SDK.

## 🚀 Features

- **Lightweight landing page:** server-rendered hero, tools carousel, selected work, about, and contact. The first load is about 280 KB gzipped. The page is type and hairlines only, with CSS scroll-driven animation (reading progress, rising sections) and no animation library.
- **Portrait puzzle:** a 3×3 sliding puzzle of Aaron's photo in the hero. It is shuffled with legal moves so it is always solvable, goes from black and white to colour on hover, and reveals the colour photo when solved.
- **Optional 3D island:** the original React Three Fiber world is loaded only after "Enter my island" is clicked, so Three.js and about 5 MB of models never slow the first visit.
- **AI Digital Twin:** a streaming chatbot (Vercel AI SDK and OpenRouter) that answers from a fixed set of facts about Aaron's projects. On the landing page the twin loads in the background after the page is ready, then greets the visitor and comments when they reach the work section and the footer. It stays off on data-saver and 2G connections.
- **Contact form:** messages reach Aaron through the Pushover API, with validation and rate limiting.
- **Cost-optimised AI:** an exact-match in-memory LRU cache for repeated prompts, and per-client rate limiting for the chat and contact routes.
- **Tests:** Vitest and React Testing Library for components, API routes and utilities.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router), React, TypeScript
- **3D:** [Three.js](https://threejs.org/), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/), Drei
- **AI:** [Vercel AI SDK](https://sdk.vercel.ai/docs), OpenRouter
- **Styling:** plain CSS and CSS Modules, with Instrument Serif self-hosted through `next/font`
- **Tests:** [Vitest](https://vitest.dev/), React Testing Library
- **Deploy:** Docker on Fly.io

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+ and npm

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

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   - `OPENROUTER_API_KEY`: for the digital twin.
   - `PUSHOVER_USER` and `PUSHOVER_TOKEN`: for the contact form.

4. Start the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## 🧪 Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run test` | Vitest, once |
| `npm run test:watch` / `test:ui` / `test:coverage` | Watch mode, UI, coverage |

GitHub Actions (`.github/workflows/ci.yml`) runs `npm run lint` and `npm run test` on every push and pull request.

## 🚢 Deployment

The app is deployed to Fly.io from the `Dockerfile` and `fly.toml`, by hand:

```bash
fly deploy
```

There is no deploy workflow in CI, so nothing deploys when you push.

## 📁 Project Structure

- `src/app`: pages and API routes (`/api/chat`, `/api/contact`). `page.tsx` is the landing page, `landing.css` its styles, `globals.css` the base and 3D-world styles, and `fonts/` the self-hosted typeface.
- `src/components`:
  - `World.tsx` and `Scene.tsx`: the 3D island, with models in `models/`.
  - `EnterWorld.tsx`: loads the island on demand.
  - `Chat.tsx` and `LandingChat.tsx`: the digital twin, in the island and on the landing page (deferred load, greetings, nudges).
  - `Puzzle.tsx`, `TechCarousel.tsx` with `tech-icons.ts`, `LocalTime.tsx`, `ContactForm.tsx`: landing page pieces.
- `src/lib`: utilities such as the rate limiter and response cache.
- `__tests__`: tests for APIs, components and utilities.
- `public`: portrait images and the 3D models.

## 📝 Editing the content

- Projects, the stack list and the hero text are at the top of `src/app/page.tsx`.
- What the digital twin knows lives in the system prompt in `src/app/api/chat/route.ts`. It is told to state only facts written there, so keep it in step with the page.
- The twin's greetings and section comments are lists at the top of `src/components/LandingChat.tsx`.

## 📄 License

This project is open source under the [MIT License](LICENSE).
