import { Test, TestingModule } from '@nestjs/testing';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { UpdateTripDto } from './dto/request/update-trip.dto';
import { GetTripDto } from './dto/request/get-trip.dto';
import { CreateTripDto } from './dto/request/create-trip.dto';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';
import { TripResponseDto } from './dto/response/trip-response.dto';

describe('TripController', () => {
  let controller: TripController;
  let service: TripService;

  const mockTripService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getMostSavedDestinations: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripController],
      providers: [
        {
          provide: TripService,
          useValue: mockTripService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TripController>(TripController);
    service = module.get<TripService>(TripService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the tripService.create method with the correct parameters', async () => {
      const req = { user: { id: 'userId' } };
      const createTripDto: CreateTripDto = {
        cost: 0,
        destination: 'tripDestination',
        display_name: 'tripDisplayName',
        duration: 0,
        origin: 'tripOrigin',
        type: 'tripType',
      };

      mockTripService.create.mockResolvedValue(createTripDto);

      const result = await controller.create(req, createTripDto);

      expect(service.create).toHaveBeenCalledWith(createTripDto, 'userId');
      expect(result).toEqual(createTripDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of TripResponseDto', async () => {
      const req = { user: { id: 'userId' } };
      const queryParams: GetTripDto = {
        /* your GetTripDto fields */
      };
      const tripResponseDto: TripResponseDto[] = [
        /* your TripResponseDto fields */
      ];

      mockTripService.findAll.mockResolvedValue(tripResponseDto);

      const result = await controller.findAll(req, queryParams);

      expect(service.findAll).toHaveBeenCalledWith('userId', queryParams);
      expect(result).toEqual(tripResponseDto);
    });
  });

  describe('getMostPopularDestinations', () => {
    it('should return an array of most saved destinations', async () => {
      const req = { user: { id: 'userId' } };
      const mostSavedDestinations = [{ id: 'destinationId', count: 5 }];

      mockTripService.getMostSavedDestinations.mockResolvedValue(
        mostSavedDestinations,
      );

      const result = await controller.getMostPopularDestinations(req);

      expect(service.getMostSavedDestinations).toHaveBeenCalledWith('userId');
      expect(result).toEqual(mostSavedDestinations);
    });
  });

  describe('update', () => {
    it('should return { ok: true } on successful update', async () => {
      const req = { user: { id: 'userId' } };
      const updateTripDto: UpdateTripDto = {
        /* your UpdateTripDto fields */
      };
      const id = 'tripId';

      mockTripService.update.mockResolvedValue({ ok: true });

      const result = await controller.update(req, id, updateTripDto);

      expect(service.update).toHaveBeenCalledWith(id, updateTripDto, 'userId');
      expect(result).toEqual({ ok: true });
    });
  });

  describe('remove', () => {
    it('should return { ok: true } on successful remove', async () => {
      const req = { user: { id: 'userId' } };
      const id = 'tripId';

      mockTripService.remove.mockResolvedValue({ ok: true });

      const result = await controller.remove(req, id);

      expect(service.remove).toHaveBeenCalledWith(id, 'userId');
      expect(result).toEqual({ ok: true });
    });
  });
});
