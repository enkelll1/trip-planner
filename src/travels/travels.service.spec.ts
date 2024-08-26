import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { TravelsService } from './travels.service';
import { TravelsRequestDto } from './dto/request/travels-request.dto';
import { TravelResponseDto } from './dto/response/travel-response.dto';
import axios from 'axios';
import { TravelsController } from './travels.controller';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';
import { CacheUtil } from '../utils/cache.util';
import { ConfigModule } from '@nestjs/config';

jest.mock('axios');

describe('TravelsService', () => {
  let service: TravelsService;
  let cacheUtil: CacheUtil;

  const mockCacheUtil = {
    getCache: jest.fn(),
    setCache: jest.fn(),
  };

  const mockTravelData: TravelResponseDto[] = [
    {
      origin: 'LAS',
      destination: 'YYZ',
      cost: 1837,
      duration: 15,
      type: 'flight',
      id: 'c80a2af9-3ff0-4451-b32f-0ba818790227',
      display_name: 'from LAS to YYZ by flight',
    },
  ];

  const mockTravelsRequest: TravelsRequestDto = {
    origin: 'LAS',
    destination: 'YYZ',
    sort_by: 'cheapest',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [TravelsController],
      providers: [
        TravelsService,
        {
          provide: CacheUtil,
          useValue: mockCacheUtil,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    service = module.get<TravelsService>(TravelsService);
    cacheUtil = module.get<CacheUtil>(CacheUtil);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTravels', () => {
    it('should return cached travels if available', async () => {
      mockCacheUtil.getCache.mockResolvedValue(mockTravelData);

      const result = await service.getAllTravels(mockTravelsRequest);

      expect(result).toEqual(mockTravelData);
      expect(mockCacheUtil.getCache).toHaveBeenCalledWith('travels:LAS:YYZ');
    });

    it('should fetch travels from API, store in cache, and return them if not cached', async () => {
      mockCacheUtil.getCache.mockResolvedValue(null);
      (axios.get as jest.Mock).mockResolvedValue({ data: mockTravelData });

      const result = await service.getAllTravels(mockTravelsRequest);

      expect(result).toEqual(mockTravelData);
      expect(mockCacheUtil.setCache).toHaveBeenCalledWith(
        'travels:LAS:YYZ',
        mockTravelData,
        7200000, // TTL should be 7200 seconds (2 hours)
      );
    });

    it('should sort the travels if sort_by parameter is provided', async () => {
      mockCacheUtil.getCache.mockResolvedValue(null);
      (axios.get as jest.Mock).mockResolvedValue({ data: mockTravelData });

      const sortedTravels = [...mockTravelData].sort((a, b) => a.cost - b.cost);

      const result = await service.getAllTravels(mockTravelsRequest);

      expect(result).toEqual(sortedTravels);
    });

    it('should throw an InternalServerErrorException if fetching from API fails', async () => {
      mockCacheUtil.getCache.mockResolvedValue(null);
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(service.getAllTravels(mockTravelsRequest)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
