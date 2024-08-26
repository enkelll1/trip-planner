import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TravelsService } from './travels.service';
import { TravelsRequestDto } from './dto/request/travels-request.dto';
import { TravelResponseDto } from './dto/response/travel-response.dto';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Travels')
@ApiBearerAuth()
@Controller('travels')
@UseGuards(AuthGuard)
export class TravelsController {
  constructor(private readonly travelsService: TravelsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success.',
    type: TravelResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getAllTravels(
    @Query() params: TravelsRequestDto,
  ): Promise<TravelResponseDto[]> {
    return await this.travelsService.getAllTravels(params);
  }
}
