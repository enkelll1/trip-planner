import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheUtil {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getCache<T>(key: string): Promise<T | null> {
    const AA = await this.cacheManager.get<T>(key);
    return await this.cacheManager.get<T>(key);
  }

  async setCache<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }
}
