import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListPassengersUseCase } from '../../application/use-cases/passengers/list-passengers.use-case';
import { GetPassengerUseCase } from '../../application/use-cases/passengers/get-passenger.use-case';
import { CreatePassengerUseCase } from '../../application/use-cases/passengers/create-passenger.use-case';
import { CreatePassengerDto } from '../dtos/passenger.dto';
import { Passenger } from '../../domain/entities/passenger.entity';

@ApiTags('passengers')
@Controller('passengers')
export class PassengersController {
  constructor(
    private readonly listPassengersUseCase: ListPassengersUseCase,
    private readonly getPassengerUseCase: GetPassengerUseCase,
    private readonly createPassengerUseCase: CreatePassengerUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all passengers' })
  @ApiResponse({ status: 200, description: 'List of all passengers', type: [Passenger] })
  async findAll(): Promise<Passenger[]> {
    return this.listPassengersUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a passenger by ID' })
  @ApiResponse({ status: 200, description: 'Passenger details', type: Passenger })
  @ApiResponse({ status: 404, description: 'Passenger not found' })
  async findById(@Param('id') id: string): Promise<Passenger> {
    return this.getPassengerUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new passenger' })
  @ApiResponse({ status: 201, description: 'Passenger created', type: Passenger })
  async create(@Body() dto: CreatePassengerDto): Promise<Passenger> {
    return this.createPassengerUseCase.execute(dto);
  }
}