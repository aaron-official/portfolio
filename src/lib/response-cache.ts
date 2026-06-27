import { LRUCache } from 'lru-cache';

// Cache up to 1000 unique conversation paths, keeping them for 24 hours.
const llmCache = new LRUCache<string, string>({
  max: 1000,
  ttl: 1000 * 60 * 60 * 24, // 24 hours
});

/**
 * Generates a unique key based on the conversation history.
 * We strip out unpredictable fields like 'id' to ensure exact matches work
 * even if the frontend generates different IDs for the same text.
 */
export function generateCacheKey(messages: any[]): string {
  const normalizedMessages = messages.map(m => ({
    role: m.role,
    content: m.content.trim().toLowerCase(),
  }));
  return JSON.stringify(normalizedMessages);
}

export function getCachedResponse(messages: any[]): string | undefined {
  const key = generateCacheKey(messages);
  return llmCache.get(key);
}

export function setCachedResponse(messages: any[], responseText: string): void {
  const key = generateCacheKey(messages);
  llmCache.set(key, responseText);
}

// For testing purposes
export function clearCache() {
  llmCache.clear();
}
