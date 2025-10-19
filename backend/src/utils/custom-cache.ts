// cache.ts
type CacheEntry<T> = { data: T; expiry: number };

export const dbCache = new Map<string, CacheEntry<any>>();
export const weatherCache = new Map<string, CacheEntry<any>>();

// Generic cache getter and setter
export function getCache<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string
): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string,
  data: T,
  ttlMs: number
) {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}
