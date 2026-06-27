import { NextResponse } from 'next/server';
import rateLimit from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    try {
      await limiter.check(3, ip); // 3 requests per hour
    } catch {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { name, contact, message } = await request.json();

    if (!name || !contact || !message) {
      return NextResponse.json(
        { error: 'Name, contact info, and message are required.' },
        { status: 400 }
      );
    }

    const PUSHOVER_TOKEN = process.env.PUSHOVER_TOKEN;
    const PUSHOVER_USER = process.env.PUSHOVER_USER;

    if (!PUSHOVER_TOKEN || !PUSHOVER_USER) {
      console.warn('Pushover tokens are not configured in .env.local');
      // We simulate success if tokens are missing so the UI still works during development
      return NextResponse.json({ success: true, warning: 'Pushover tokens missing.' });
    }

    const pushoverResponse = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: PUSHOVER_TOKEN,
        user: PUSHOVER_USER,
        title: `New Portfolio Message from ${name}`,
        message: `Contact: ${contact}\n\nMessage:\n${message}`,
        priority: 0, // Normal priority
      }),
    });

    if (!pushoverResponse.ok) {
      const errorData = await pushoverResponse.json();
      console.error('Pushover error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send notification via Pushover.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Contact Error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
