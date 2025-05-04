import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListTripsUseCase } from '../../application/use-cases/trips/list-trips.use-case';
import { GetTripUseCase } from '../../application/use-cases/trips/get-trip.use-case';
import { CreateTripUseCase } from '../../application/use-cases/trips/create-trip.use-case';
import { CompleteTripUseCase } from '../../application/use-cases/trips/complete-trip.use-case';
import { CreateTripDto, CompleteTripDto } from '../dtos/trip.dto';
import { Trip } from '../../domain/entities/trip.entity';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(
    private readonly listTripsUseCase: ListTripsUseCase,
    private readonly getTripUseCase: GetTripUseCase,
    private readonly createTripUseCase: CreateTripUseCase,
    private readonly completeTripUseCase: CompleteTripUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all trips' })
  @ApiResponse({ status: 200, description: 'List of all trips', type: [Trip] })
  async findAll(): Promise<Trip[]> {
    return this.listTripsUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a trip by ID' })
  @ApiResponse({ status: 200, description: 'Trip details', type: Trip })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async findById(@Param('id') id: string): Promise<Trip> {
    return this.getTripUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 201, description: 'Trip created', type: Trip })
  async create(@Body() dto: CreateTripDto): Promise<Trip> {
    return this.createTripUseCase.execute(dto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete a trip' })
  @ApiResponse({ status: 200, description: 'Trip completed', type: Trip })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async complete(@Param('id') id: string, @Body() dto: CompleteTripDto): Promise<Trip> {
    return this.completeTripUseCase.execute(id, dto);
  }
}