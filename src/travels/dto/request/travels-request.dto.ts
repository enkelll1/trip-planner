import { IsIn, IsOptional, IsString } from 'class-validator';
import { AIRPORT_CODES } from '../../../constants/airport_codes';
import { ApiProperty } from '@nestjs/swagger';

export class TravelsRequestDto {
  @ApiProperty({
    example: 'LAS',
    required: true,
  })
  @IsString()
  @IsIn(AIRPORT_CODES, {
    message: 'origin must be a valid airport code ( IATA 3 letter code)',
  })
  origin: string;

  @ApiProperty({
    example: 'YYZ',
    required: true,
  })
  @IsString()
  @IsIn(AIRPORT_CODES, {
    message: 'destination must be a valid airport code ( IATA 3 letter code)',
  })
  destination: string;

  @ApiProperty({
    example: 'slowest',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['fastest', 'slowest', 'cheapest', 'expensive'])
  sort_by?: string;
}
