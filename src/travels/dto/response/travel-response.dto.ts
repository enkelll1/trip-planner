import { IsString, IsInt, IsUUID, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TravelResponseDto {
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
    example: '6587fddb',
    required: true,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 'trip_name',
    required: true,
  })
  @IsString()
  display_name: string;
}
