import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/request/create-trip.dto';
import { UpdateTripDto } from './dto/request/update-trip.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip } from './entities/trip.entity';
import { GetTripDto } from './dto/request/get-trip.dto';
import { TripResponseDto } from './dto/response/trip-response.dto';
import { Types } from 'mongoose';

@Injectable()
export class TripService {
  constructor(@InjectModel('Trip') private tripModel: Model<Trip>) {}

  async create(
    createTripDto: CreateTripDto,
    userId: string,
  ): Promise<TripResponseDto> {
    const trip: Trip = await this.tripModel.create({
      ...createTripDto,
      user_id: userId,
    });
    return TripResponseDto.fromEntity(trip);
  }

  async findAll(
    userId: string,
    queryParams: GetTripDto,
  ): Promise<TripResponseDto[]> {
    const trips: Trip[] = await this.tripModel
      .find({ user_id: userId }, null, this.sortTravels(queryParams.sort_by))
      .exec();

    return TripResponseDto.fromEntities(trips);
  }

  async getMostSavedDestinations(
    userId: string,
  ): Promise<{ id: string; count: number }[]> {
    return this.tripModel.aggregate([
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
  }

  async update(
    id: string,
    updateTripDto: UpdateTripDto,
    userId: string,
  ): Promise<{ ok: true }> {
    const updatedResult = await this.tripModel.updateOne(
      { _id: id, user_id: userId },
      updateTripDto,
    );
    if (updatedResult.modifiedCount == 0) {
      throw new ForbiddenException(
        'Trip failed to update, please check if this trip belongs to this user',
      );
    }

    return { ok: true };
  }

  async remove(id: string, user_id: string): Promise<{ ok: true }> {
    const deletedResult = await this.tripModel.deleteOne({
      _id: id,
      user_id: user_id,
    });
    if (deletedResult.deletedCount == 0) {
      throw new ForbiddenException(
        'Trip failed to delete, please check if this trip belongs to this user',
      );
    }
    return { ok: true };
  }

  private sortTravels(sortBy: string): { sort?: { [key: string]: 1 | -1 } } {
    switch (sortBy) {
      case 'cheapest':
        return { sort: { cost: 1 } };
      case 'expensive':
        return { sort: { cost: -1 } };
      case 'fastest':
        return { sort: { duration: 1 } };
      case 'slowest':
        return { sort: { duration: -1 } };
      default:
        return {};
    }
  }
}
