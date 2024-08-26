import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/request/create-trip.dto';
import { UpdateTripDto } from './dto/request/update-trip.dto';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTripDto } from './dto/request/get-trip.dto';
import { TripResponseDto } from './dto/response/trip-response.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Trips')
@ApiBearerAuth()
@Controller('trip')
@UseGuards(AuthGuard)
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Success.', type: TripResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(
    @Request() req,
    @Body() createTripDto: CreateTripDto,
  ): Promise<TripResponseDto> {
    return this.tripService.create(createTripDto, req.user.id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success.',
    type: [TripResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll(
    @Request() req,
    @Query() queryParams: GetTripDto,
  ): Promise<TripResponseDto[]> {
    return this.tripService.findAll(req.user.id, queryParams);
  }

  @Get('analytics/most-saved-destinations')
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  getMostPopularDestinations(
    @Request() req,
  ): Promise<{ id: string; count: number }[]> {
    return this.tripService.getMostSavedDestinations(req.user.id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({
    type: UpdateTripDto,
    description:
      'The JSON structure of the body is the same as in the create trip request, but all fields are optional.',
  })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
  ): Promise<{ ok: true }> {
    return this.tripService.update(id, updateTripDto, req.user.id);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Request() req, @Param('id') id: string): Promise<{ ok: true }> {
    return this.tripService.remove(id, req.user.id);
  }
}
