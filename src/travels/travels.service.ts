import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { TravelsRequestDto } from './dto/request/travels-request.dto';
import { TravelResponseDto } from './dto/response/travel-response.dto';
import { CacheUtil } from '../utils/cache.util';
import * as process from 'node:process';

@Injectable()
export class TravelsService {
  constructor(private readonly cacheUtil: CacheUtil) {}

  async getAllTravels(
    travelsRequest: TravelsRequestDto,
  ): Promise<TravelResponseDto[]> {
    try {
      const cacheKey = this.getCacheKey(travelsRequest);
      const cachedTravels =
        await this.cacheUtil.getCache<TravelResponseDto[]>(cacheKey);

      if (cachedTravels) {
        return travelsRequest.sort_by
          ? this.sortTravels(travelsRequest.sort_by, cachedTravels)
          : cachedTravels;
      }

      const apiKeyHeader = {
        'x-api-key': process.env.TRAVELS_API_KEY,
      };
      const apiUrl = `${process.env.TRAVELS_API}?origin=${travelsRequest.origin}&destination=${travelsRequest.destination}`;
      const { data } = await axios.get(apiUrl, {
        headers: apiKeyHeader,
      });

      // Note: Since the data from the API is static, it is stored in Redis with a fixed TTL of 2 hours (7200 seconds).
      // If the data were dynamic and included a travel time, the caching logic would differ.
      // Time  would be calculated based on the nearest travel time to ensure the cache is valid and relevant.
      await this.cacheUtil.setCache(cacheKey, data, 7200000);

      return travelsRequest.sort_by
        ? this.sortTravels(travelsRequest.sort_by, data)
        : data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to load travel data. Please try again later.',
      );
    }
  }

  private sortTravels(sortBy: string, travelsData: any) {
    switch (sortBy) {
      case 'cheapest':
        return travelsData.sort((a, b) => a.cost - b.cost);
      case 'expensive':
        return travelsData.sort((a, b) => b.cost - a.cost);
      case 'fastest':
        return travelsData.sort((a, b) => a.duration - b.duration);
      case 'slowest':
        return travelsData.sort((a, b) => b.duration - a.duration);
      default:
        return travelsData;
    }
  }

  private getCacheKey(travelsRequest: TravelsRequestDto): string {
    return `travels:${travelsRequest.origin}:${travelsRequest.destination}`;
  }
}
