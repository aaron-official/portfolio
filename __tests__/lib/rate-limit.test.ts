import { describe, it, expect, beforeEach } from 'vitest';
import rateLimit from '@/lib/rate-limit';

describe('rateLimit utility', () => {
  it('should allow requests below the limit', async () => {
    const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });
    
    // Simulate 2 requests from the same IP (limit is 3)
    await expect(limiter.check(3, '127.0.0.1')).resolves.toBeUndefined();
    await expect(limiter.check(3, '127.0.0.1')).resolves.toBeUndefined();
  });

  it('should reject requests that exceed the limit', async () => {
    const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });
    
    // Fill up the limit
    await limiter.check(2, '192.168.1.1');
    await limiter.check(2, '192.168.1.1');
    
    // Third request should throw/reject
    await expect(limiter.check(2, '192.168.1.1')).rejects.toBeUndefined();
  });

  it('should track different IPs independently', async () => {
    const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });
    
    // IP 1 exceeds limit
    await limiter.check(1, 'ip-1');
    await expect(limiter.check(1, 'ip-1')).rejects.toBeUndefined();
    
    // IP 2 should still be allowed
    await expect(limiter.check(1, 'ip-2')).resolves.toBeUndefined();
  });
});
