import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListDriversUseCase } from '../../application/use-cases/drivers/list-drivers.use-case';
import { ListAvailableDriversUseCase } from '../../application/use-cases/drivers/list-available-drivers.use-case';
import { ListNearbyDriversUseCase } from '../../application/use-cases/drivers/list-nearby-drivers.use-case';
import { NearbyDriversDto } from '../dtos/nearby-drivers.dto';
import { Driver } from '../../domain/entities/driver.entity';

@ApiTags('drivers')
@Controller('drivers')
export class DriversController {
  constructor(
    private readonly listDriversUseCase: ListDriversUseCase,
    private readonly listAvailableDriversUseCase: ListAvailableDriversUseCase,
    private readonly listNearbyDriversUseCase: ListNearbyDriversUseCase
  ) {  
      console.log('DriversController initialized');
  }

  @Get()
  @ApiOperation({ summary: 'List all drivers' })
  @ApiResponse({
    status: 200,
    description: 'List of all drivers',
    type: [Driver],
  })
  async findAll(): Promise<Driver[]> {
    return this.listDriversUseCase.execute();
  }

  @Get('available')
  @ApiOperation({ summary: 'List available drivers' })
  @ApiResponse({
    status: 200,
    description: 'List of available drivers',
    type: [Driver],
  })
  async findAvailable(): Promise<Driver[]> {
    return this.listAvailableDriversUseCase.execute();
  }

  @Get('nearby')
  @ApiOperation({ summary: 'List nearby drivers' })
  @ApiResponse({
    status: 200,
    description: 'List of nearby drivers',
    type: [Driver],
  })
  async findNearby(@Query() dto: NearbyDriversDto): Promise<Driver[]> {
    console.log('Received NearbyDriversDto:', dto); // Log para depuración
    return this.listNearbyDriversUseCase.execute(dto);
  }
}
