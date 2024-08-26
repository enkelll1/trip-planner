import { Test, TestingModule } from '@nestjs/testing';
import { TravelsController } from './travels.controller';
import { TravelResponseDto } from './dto/response/travel-response.dto';
import { TravelsService } from './travels.service';
import { TravelsRequestDto } from './dto/request/travels-request.dto';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';

describe('TravelsController', () => {
  let controller: TravelsController;
  let service: TravelsService;

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

  const mockTravelsService = {
    getAllTravels: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelsController],
      providers: [
        {
          provide: TravelsService,
          useValue: mockTravelsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TravelsController>(TravelsController);
    service = module.get<TravelsService>(TravelsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTravels', () => {
    it('should call getAllTravels from TravelsService and return the result', async () => {
      const mockRequestDto: TravelsRequestDto = {
        origin: 'LAS',
        destination: 'YYZ',
        sort_by: 'cheapest',
      };

      mockTravelsService.getAllTravels.mockResolvedValue(mockTravelData);

      const result = await controller.getAllTravels(mockRequestDto);

      expect(service.getAllTravels).toHaveBeenCalledWith(mockRequestDto);
      expect(result).toEqual(mockTravelData);
    });
  });
});
