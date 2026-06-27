import { describe, it, expect, beforeEach } from 'vitest';
import { generateCacheKey, getCachedResponse, setCachedResponse, clearCache } from '@/lib/response-cache';

describe('Response Cache Utility', () => {
  beforeEach(() => {
    clearCache();
  });

  it('normalizes messages into a deterministic key', () => {
    const messages1 = [{ id: '1', role: 'user', content: 'Hello' }];
    const messages2 = [{ id: '2', role: 'user', content: ' hello ' }];
    
    expect(generateCacheKey(messages1)).toBe(generateCacheKey(messages2));
  });

  it('sets and retrieves a cached response', () => {
    const messages = [{ role: 'user', content: 'What is your stack?' }];
    const response = 'I use Next.js and React.';
    
    setCachedResponse(messages, response);
    expect(getCachedResponse(messages)).toBe(response);
  });

  it('returns undefined for an uncached conversation', () => {
    const messages = [{ role: 'user', content: 'Unknown question' }];
    expect(getCachedResponse(messages)).toBeUndefined();
  });
});
