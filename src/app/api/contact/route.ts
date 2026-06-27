import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, contact, message } = await request.json();

    if (!name || !contact || !message) {
      return NextResponse.json(
        { error: 'Name, contact info, and message are required.' },
        { status: 400 }
      );
    }

    const PUSHOVER_APP_TOKEN = process.env.PUSHOVER_APP_TOKEN;
    const PUSHOVER_USER_KEY = process.env.PUSHOVER_USER_KEY;

    if (!PUSHOVER_APP_TOKEN || !PUSHOVER_USER_KEY) {
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
        token: PUSHOVER_APP_TOKEN,
        user: PUSHOVER_USER_KEY,
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
