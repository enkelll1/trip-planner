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
    const req = { user: { id: 'userId' } }; // Mocked request object with a user
    const createTripDto: CreateTripDto = {
      display_name: 'Test display name',
      type: 'Test type',
      origin: 'Test Origin',
      destination: 'Test Destination',
      cost: 100,
      duration: 2,
    };
    const tripResponse: TripResponseDto = {
      id: 'someId',
      user_id: 'someUserId',
      ...createTripDto,
    };

    it('should create a trip successfully and return TripResponseDto', async () => {
      mockTripService.create.mockResolvedValue(tripResponse);

      const result = await controller.create(req, createTripDto);

      expect(result).toEqual(tripResponse);
      expect(mockTripService.create).toHaveBeenCalledWith(
        createTripDto,
        req.user.id,
      );
    });
  });

  describe('findAll', () => {
    const req = { user: { id: 'userId' } };
    const queryParams: GetTripDto = {
      sort_by: 'cheapest',
    };
    it('should return an array of TripResponseDto', async () => {
      const tripResponseDto: TripResponseDto[] = [
        {
          id: 'someId',
          user_id: 'someUserId',
          display_name: 'Test display name',
          type: 'Test type',
          origin: 'Test Origin',
          destination: 'Test Destination',
          cost: 100,
          duration: 2,
        },
      ];

      mockTripService.findAll.mockResolvedValue(tripResponseDto);

      const result = await controller.findAll(req, queryParams);

      expect(service.findAll).toHaveBeenCalledWith(req.user.id, queryParams);
      expect(result).toEqual(tripResponseDto);
    });
  });

  describe('getMostPopularDestinations', () => {
    const req = { user: { id: 'userId' } };
    it('should return an array of most saved destinations', async () => {
      const mostSavedDestinations = [{ id: 'destinationId', count: 5 }];

      mockTripService.getMostSavedDestinations.mockResolvedValue(
        mostSavedDestinations,
      );

      const result = await controller.getMostPopularDestinations(req);

      expect(service.getMostSavedDestinations).toHaveBeenCalledWith(
        req.user.id,
      );
      expect(result).toEqual(mostSavedDestinations);
    });
  });

  describe('update', () => {
    const id = 'tripId';
    const req = { user: { id: 'userId' } };
    const updateTripDto: UpdateTripDto = {
      origin: 'Updated Trip origin',
    };

    it('should return { ok: true } on successful update', async () => {
      mockTripService.update.mockResolvedValue({ ok: true });

      const result = await controller.update(req, id, updateTripDto);

      expect(service.update).toHaveBeenCalledWith(
        id,
        updateTripDto,
        req.user.id,
      );
      expect(result).toEqual({ ok: true });
    });
  });

  describe('remove', () => {
    const req = { user: { id: 'userId' } };
    const id = 'tripId';
    it('should return { ok: true } on successful remove', async () => {
      mockTripService.remove.mockResolvedValue({ ok: true });

      const result = await controller.remove(req, id);

      expect(service.remove).toHaveBeenCalledWith(id, req.user.id);
      expect(result).toEqual({ ok: true });
    });
  });
});
