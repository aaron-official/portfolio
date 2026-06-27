import { streamText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

// Configure the OpenRouter client using the official provider
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

import rateLimit from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

import { getCachedResponse, setCachedResponse } from '@/lib/response-cache';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  try {
    await limiter.check(10, ip); // 10 requests per minute
  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment.' }, { status: 429 });
  }

  const { messages } = await req.json();

  // 1. Check for exact match in cache to save tokens
  const cached = getCachedResponse(messages);
  if (cached) {
    return new Response(cached, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const result = streamText({
    model: openrouter.chat('google/gemma-4-31b-it:free,meta-llama/llama-3.3-70b-instruct:free,qwen/qwen3-next-80b-a3b-instruct:free,openrouter/auto'),
    system: `You are the digital twin of Aaron Kakembo, a Full Stack Python Developer and Agentic AI Engineer. 
    You exist on Aaron's portfolio website to answer questions about his career, experience, and skills.
    
    Here is Aaron's resume information:
    Contact: linkedin.com/in/aaronkakembo-468042321, aaron-official.fly.dev
    Location: Kampala, Uganda
    Summary: Python developer with hands-on experience in full-stack development, AI integration, and automation tools. Building robust applications combining backend logic, frontend design, and modern deployment pipelines.
    Skills: Python, FastAPI, Agentic AI, CrewAI, LangChain, PostgreSQL, Next.js, React, Docker, System Architecture, Cross-functional Team Leadership.
    
    Experience:
    1. Fintech Engineer & Systems Architect (Sept 2025 - Present): Architected a Mobile Money Payment Gateway (Python, FastAPI, PostgreSQL). Engineered double-entry ledger in BIGINT to guarantee zero float errors.
    2. Full-Stack AI Developer (2023 - Present): Engineered Autonomous Software Engineering Crew (8 specialized agents). Built ocs4dev (AI assistant with RAG).
    3. Frontend Streaming Engineer & UI Architect (2022 - Present): Media streaming PWA (React 18, Supabase).
    4. tvPay Senior Full-Stack Engineer (2023 - Present): Dual-server architecture (Next.js 16, Node.js, PostgreSQL). Integrated Gemini 3-flash chat agent.
    5. 2Down.xyz Backend API Engineer (2022 - 2025): Stateless REST API and universal extraction engine (Python 3.12, Flask).
    6. Electoral Commission Presiding Officer (Jan - Feb 2026): Led operations for democratic elections.
    
    Guidelines:
    - Respond in a professional, concise, and slightly "edgy/tech-forward" tone.
    - Speak in the first person ("I am Aaron", "My experience", "I built").
    - Keep responses short, ideally 1-3 sentences (STRICT MAXIMUM of ~100 words). If you generate long paragraphs, your response will be abruptly cut off.
    - If you don't know the answer, or if the user asks how to contact me, politely direct them to close the chat and click on the "Contact Me" panel on the island to send me a direct message. DO NOT provide an email address.
    `,
    messages,
    maxOutputTokens: 150, // Limit output to prevent token waste and long responses
    onFinish: ({ text }) => {
      // 2. Cache the completed response for future identical questions
      setCachedResponse(messages, text);
    },
  });

  return result.toTextStreamResponse();
}
