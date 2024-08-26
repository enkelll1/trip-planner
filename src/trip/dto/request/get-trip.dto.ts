import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTripDto {
  @ApiProperty({
    example: 'slowest',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['fastest', 'slowest', 'cheapest', 'expensive'])
  sort_by?: string;
}
