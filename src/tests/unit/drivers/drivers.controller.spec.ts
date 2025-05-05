import { Test, TestingModule } from '@nestjs/testing';
import { DriversController } from '../../../infrastructure/controllers/drivers.controller';
import { ListDriversUseCase } from '../../../application/use-cases/drivers/list-drivers.use-case';
import { ListAvailableDriversUseCase } from '../../../application/use-cases/drivers/list-available-drivers.use-case';
import { ListNearbyDriversUseCase } from '../../../application/use-cases/drivers/list-nearby-drivers.use-case';
import { Driver } from '../../../domain/entities/driver.entity';
import { NearbyDriversDto } from '../../../infrastructure/dtos/nearby-drivers.dto';
import { DriverStatus } from '../../../domain/entities/enums/driver-status.enum';

describe('DriversController', () => {
  let controller: DriversController;
  let listDriversUseCase: ListDriversUseCase;
  let listAvailableDriversUseCase: ListAvailableDriversUseCase;
  let listNearbyDriversUseCase: ListNearbyDriversUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [
        {
          provide: ListDriversUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListAvailableDriversUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListNearbyDriversUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<DriversController>(DriversController);
    listDriversUseCase = module.get<ListDriversUseCase>(ListDriversUseCase);
    listAvailableDriversUseCase = module.get<ListAvailableDriversUseCase>(
      ListAvailableDriversUseCase
    );
    listNearbyDriversUseCase = module.get<ListNearbyDriversUseCase>(
      ListNearbyDriversUseCase
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of drivers', async () => {
      const drivers: Driver[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Juan Pérez',
          phone: '1234567890',
          location: 'SRID=4326;POINT(-74.006 40.7128)',
          status: DriverStatus.AVAILABLE,
          created_at: new Date(),
        },
      ];
      jest.spyOn(listDriversUseCase, 'execute').mockResolvedValue(drivers);

      const result = await controller.findAll();
      expect(result).toEqual(drivers);
      expect(listDriversUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('findAvailable', () => {
    it('should return a list of available drivers', async () => {
      const drivers: Driver[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Juan Pérez',
          phone: '1234567890',
          location: 'SRID=4326;POINT(-74.006 40.7128)',
          status: DriverStatus.AVAILABLE,
          created_at: new Date(),
        },
      ];
      jest
        .spyOn(listAvailableDriversUseCase, 'execute')
        .mockResolvedValue(drivers);

      const result = await controller.findAvailable();
      expect(result).toEqual(drivers);
      expect(listAvailableDriversUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('findNearby', () => {
    it('should return a list of nearby drivers', async () => {
      const drivers: Driver[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Juan Pérez',
          phone: '1234567890',
          location: 'SRID=4326;POINT(-74.006 40.7128)',
          status: DriverStatus.AVAILABLE,
          created_at: new Date(),
        },
      ];
      const dto: NearbyDriversDto = {
        latitude: 40.7128,
        longitude: -74.006,
        radius: 5,
      };
      jest
        .spyOn(listNearbyDriversUseCase, 'execute')
        .mockResolvedValue(drivers);

      const result = await controller.findNearby(dto);
      expect(result).toEqual(drivers);
      expect(listNearbyDriversUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });
});
