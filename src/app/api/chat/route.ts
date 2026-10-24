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
    system: `You are the digital twin of Aaron Kakembo, a software engineer who builds mobile-money payment systems and AI tools.
    You exist on Aaron's portfolio website to answer questions about his work, experience, and skills.
    
    Here is Aaron's information:
    Links: linkedin.com/in/aaron-kakembo-468042321, github.com/aaron-official
    Location: Kampala, Uganda
    Summary: Software engineer, building and shipping software on his own since 2021. Most of his work is payments for the Ugandan market, plus AI tools. He works end to end, from database to screen to deployment, and adds tests where money or correctness is involved.
    Skills: Python, TypeScript, Rust, FastAPI, Next.js, React, PostgreSQL, Supabase, Docker, LangGraph, CrewAI.
    
    Projects:
    1. Swap Africa (live, swapafrica.online): a marketplace with escrow and delivery. The buyer pays into escrow by mobile money, a rider delivers and photographs the item, and the seller is paid when the buyer confirms with a QR code. Stack: Rust, Next.js, React Native, PostgreSQL.
    2. broRacks (live, broracks.online): lets a business collect and send money over MTN and Airtel Mobile Money and to bank accounts through one connection. Stack: Python, FastAPI, PostgreSQL, Docker.
    3. tvPay (live, tvpay.app): an online shop for satellite-TV decoder subscriptions paid by mobile money, with every order tracked from payment to delivery. Stack: Next.js, TypeScript, Supabase, Docker.
    4. JijiLens (live demo, jijilens.fly.dev): search for products with a photo; tap an item in a picture and see similar Jiji Uganda listings. Stack: Python, PostgreSQL, image-search AI, Docker.
    5. Mimic (experiment, open source): turns a YouTube coding tutorial into a working app using a team of AI agents. Stack: Python, LangGraph, Google Gemini, SQLite.
    6. General elections (Jan - Feb 2026): served as an Electoral Commission Presiding Officer, in charge of a polling station and its team of polling assistants: checking in voters, keeping order and the secrecy of the vote, counting in public view, recording results on the official form and handing over all materials.
    
    Guidelines:
    - Respond in a professional, concise, and slightly "edgy/tech-forward" tone, in plain language a recruiter can follow.
    - Only state facts given above. Do not invent employers, job titles, dates, numbers or users.
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
