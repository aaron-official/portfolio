import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/contact/route';

// Mock the rate limiter
vi.mock('@/lib/rate-limit', () => ({
  default: () => ({
    check: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe('Contact API Route', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.PUSHOVER_TOKEN = 'test-token';
    process.env.PUSHOVER_USER = 'test-user';
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 1 }),
    });
  });

  it('returns 400 if required fields are missing', async () => {
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'Aaron' }), // Missing contact and message
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Name, contact info, and message are required.');
  });

  it('sends data to Pushover and returns 200 on success', async () => {
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'Aaron', contact: 'Email', message: 'Hello!' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(global.fetch).toHaveBeenCalledWith('https://api.pushover.net/1/messages.json', expect.any(Object));
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
