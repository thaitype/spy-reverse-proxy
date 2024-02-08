import { LRUCache } from 'lru-cache';

export type CacheKey = 'spyConfig';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cache = new LRUCache<CacheKey, string>({
  max: 500,
});

// export class AppCache {
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   constructor(private cache: LRUCache<{}, {}>) {}

//   get(key: CacheKey) {
//     return this.cache.get(key);
//   }

//   set(key: CacheKey, value: string) {
//     lruCache.set(key, value);
//   }
// }

// export const cache = new AppCache(lruCache);
