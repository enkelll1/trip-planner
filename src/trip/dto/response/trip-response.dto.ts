import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { CURRENCY_CODES } from '../../../constants/currency_codes';
import { Trip } from '../../entities/trip.entity';
import { ApiProperty } from '@nestjs/swagger';

export class TripResponseDto {
  @IsString()
  id: string;

  @IsString()
  user_id: string;

  @ApiProperty({
    example: 'LAS',
    required: true,
  })
  @IsString()
  origin: string;

  @ApiProperty({
    example: 'YYZ',
    required: true,
  })
  @IsString()
  destination: string;

  @ApiProperty({
    example: 200,
    required: true,
  })
  @IsInt()
  @IsPositive()
  cost: number;

  @ApiProperty({
    example: 30,
    required: true,
  })
  @IsInt()
  @IsPositive()
  duration: number;

  @ApiProperty({
    example: 'flight',
    required: true,
  })
  @IsString()
  type: string;

  @ApiProperty({
    example: 'trip_name',
    required: true,
  })
  @IsString()
  display_name: string;

  @ApiProperty({
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  travelers_number?: number;

  @ApiProperty({
    example: 1900,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  total_budget?: number;

  @ApiProperty({
    example: 'USD',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(CURRENCY_CODES, {
    message: 'currency must be a valid currency code ( IATA 3 letter code)',
  })
  currency?: string;

  public static fromEntity(trip: Trip): TripResponseDto {
    const tripDto = new TripResponseDto();
    tripDto.id = trip._id.toString();
    tripDto.display_name = trip.display_name;
    tripDto.user_id = trip.user_id;
    tripDto.origin = trip.origin;
    tripDto.type = trip.type;
    tripDto.destination = trip.destination;
    tripDto.cost = trip.cost;
    tripDto.duration = trip.duration;
    tripDto.travelers_number = trip.travelers_number;
    tripDto.total_budget = trip.total_budget;
    tripDto.currency = trip.currency;
    return tripDto;
  }

  static fromEntities(trips: any[]): TripResponseDto[] {
    return trips.map((trip) => this.fromEntity(trip));
  }
}
