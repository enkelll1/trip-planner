import {
  IsString,
  IsInt,
  IsUUID,
  IsPositive,
  IsIn,
  IsOptional,
} from 'class-validator';
import { AIRPORT_CODES } from '../../../constants/airport_codes';
import { CURRENCY_CODES } from '../../../constants/currency_codes';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTripDto {
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
}
