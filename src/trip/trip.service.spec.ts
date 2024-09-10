import { Test, TestingModule } from '@nestjs/testing';
import { TripService } from './trip.service';
import { UpdateTripDto } from './dto/request/update-trip.dto';
import { GetTripDto } from './dto/request/get-trip.dto';
import { CreateTripDto } from './dto/request/create-trip.dto';
import mongoose, { Model, Types } from 'mongoose';
import { Trip } from './entities/trip.entity';
import { getModelToken } from '@nestjs/mongoose';
import { ForbiddenException } from '@nestjs/common';
import { TripResponseDto } from './dto/response/trip-response.dto';

describe('TripService', () => {
  let service: TripService;
  let model: Model<Trip>;

  const mockTripModel = {
    create: jest.fn(),
    find: jest.fn(),
    aggregate: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripService,
        {
          provide: getModelToken('Trip'),
          useValue: mockTripModel,
        },
      ],
    }).compile();

    service = module.get<TripService>(TripService);
    model = module.get<Model<Trip>>(getModelToken('Trip'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a trip and return it', async () => {
      const createTripDto: CreateTripDto = {
        display_name: 'Test display name',
        type: 'Test type',
        origin: 'Test Origin',
        destination: 'Test Destination',
        cost: 100,
        duration: 2,
      };
      const userId = 'userId';
      const createdTrip = {
        ...createTripDto,
        _id: new mongoose.Types.ObjectId('66cb1a46433ce91a885e06fd'),
        user_id: userId,
      };
      mockTripModel.create.mockResolvedValue(createdTrip);

      const result = await service.create(createTripDto, userId);

      expect(mockTripModel.create).toHaveBeenCalledWith({
        ...createTripDto,
        user_id: userId,
      });
      expect(result).toEqual(TripResponseDto.fromEntity(createdTrip));
    });
  });

  describe('findAll', () => {
    it('should return an array of trips', async () => {
      const userId = 'userId';
      const queryParams: GetTripDto = { sort_by: 'cheapest' };
      const trips = [
        {
          _id: 'someId',
          user_id: userId,
          display_name: 'Test display name',
          type: 'Test type',
          origin: 'Test Origin',
          destination: 'Test Destination',
          cost: 100,
          duration: 2,
        },
      ];
      mockTripModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(trips),
      });

      const result = await service.findAll(userId, queryParams);

      expect(mockTripModel.find).toHaveBeenCalledWith(
        { user_id: userId },
        null,
        service['sortTravels'](queryParams.sort_by),
      );
      expect(result).toEqual(TripResponseDto.fromEntities(trips));
    });
  });

  describe('getMostSavedDestinations', () => {
    it('should return the top 5 most saved destinations', async () => {
      const userId = '66cb1a46433ce91a885e06fd';
      const aggregatedResult = [
        { _id: 'Destination1', count: 5 },
        { _id: 'Destination2', count: 3 },
      ];
      mockTripModel.aggregate.mockResolvedValue(aggregatedResult);

      const result = await service.getMostSavedDestinations(userId);

      expect(mockTripModel.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            user_id: new Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: '$destination',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 5,
        },
      ]);
      expect(result).toEqual(aggregatedResult);
    });
  });

  describe('update', () => {
    it('should update a trip and return ok if successful', async () => {
      const userId = 'userId';
      const tripId = 'tripId';
      const updateTripDto: UpdateTripDto = { origin: 'Updated Trip origin' };
      mockTripModel.updateOne.mockResolvedValue({ modifiedCount: 1 });

      const result = await service.update(tripId, updateTripDto, userId);

      expect(mockTripModel.updateOne).toHaveBeenCalledWith(
        { _id: tripId, user_id: userId },
        updateTripDto,
      );
      expect(result).toEqual({ ok: true });
    });

    it('should throw a ForbiddenException if update fails', async () => {
      const userId = 'userId';
      const tripId = 'tripId';
      const updateTripDto: UpdateTripDto = { origin: 'Updated Origin' };
      mockTripModel.updateOne.mockResolvedValue({ modifiedCount: 0 });

      await expect(
        service.update(tripId, updateTripDto, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a trip and return ok if successful', async () => {
      const userId = 'userId';
      const tripId = 'tripId';
      mockTripModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await service.remove(tripId, userId);

      expect(mockTripModel.deleteOne).toHaveBeenCalledWith({
        _id: tripId,
        user_id: userId,
      });
      expect(result).toEqual({ ok: true });
    });

    it('should throw a ForbiddenException if removal fails', async () => {
      const userId = 'userId';
      const tripId = 'tripId';
      mockTripModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(service.remove(tripId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
