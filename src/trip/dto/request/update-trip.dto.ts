import { PartialType } from '@nestjs/mapped-types';
import { CreateTripDto } from './create-trip.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateTripDto extends PartialType(OmitType(CreateTripDto, [])) {}
