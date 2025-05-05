import { Test, TestingModule } from '@nestjs/testing';
import { PassengersController } from '../../../infrastructure/controllers/passengers.controller';
import { ListPassengersUseCase } from '../../../application/use-cases/passengers/list-passengers.use-case';
import { GetPassengerUseCase } from '../../../application/use-cases/passengers/get-passenger.use-case';
import { CreatePassengerUseCase } from '../../../application/use-cases/passengers/create-passenger.use-case';
import { ListNearbyDriversUseCase } from '../../../application/use-cases/drivers/list-nearby-drivers.use-case';
import { CreatePassengerDto } from '../../../infrastructure/dtos/passenger.dto';
import { Passenger } from '../../../domain/entities/passenger.entity';
import { Driver } from '../../../domain/entities/driver.entity';
import { NotFoundException } from '@nestjs/common';
import { DriverStatus } from '../../../domain/entities/enums/driver-status.enum';

describe('PassengersController', () => {
  let controller: PassengersController;
  let listPassengersUseCase: ListPassengersUseCase;
  let getPassengerUseCase: GetPassengerUseCase;
  let createPassengerUseCase: CreatePassengerUseCase;
  let listNearbyDriversUseCase: ListNearbyDriversUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengersController],
      providers: [
        {
          provide: ListPassengersUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetPassengerUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreatePassengerUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListNearbyDriversUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<PassengersController>(PassengersController);
    listPassengersUseCase = module.get<ListPassengersUseCase>(ListPassengersUseCase);
    getPassengerUseCase = module.get<GetPassengerUseCase>(GetPassengerUseCase);
    createPassengerUseCase = module.get<CreatePassengerUseCase>(CreatePassengerUseCase);
    listNearbyDriversUseCase = module.get<ListNearbyDriversUseCase>(ListNearbyDriversUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of passengers', async () => {
      const passengers: Passenger[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Ana Martínez',
          phone: '1112223333',
          created_at: new Date(),
        },
      ];
      jest.spyOn(listPassengersUseCase, 'execute').mockResolvedValue(passengers);

      const result = await controller.findAll();
      expect(result).toEqual(passengers);
      expect(listPassengersUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a passenger by ID', async () => {
      const passenger: Passenger = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Ana Martínez',
        phone: '1112223333',
        created_at: new Date(),
      };
      jest.spyOn(getPassengerUseCase, 'execute').mockResolvedValue(passenger);

      const result = await controller.findById('550e8400-e29b-41d4-a716-446655440003');
      expect(result).toEqual(passenger);
      expect(getPassengerUseCase.execute).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440003');
    });

    it('should throw NotFoundException if passenger not found', async () => {
      jest.spyOn(getPassengerUseCase, 'execute').mockRejectedValue(
        new NotFoundException('Passenger with ID 550e8400-e29b-41d4-a716-999999999999 not found'),
      );

      await expect(controller.findById('550e8400-e29b-41d4-a716-999999999999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new passenger', async () => {
      const dto: CreatePassengerDto = { name: 'Test Passenger', phone: '1234567890' };
      const passenger: Passenger = {
        id: '550e8400-e29b-41d4-a716-446655440006',
        name: dto.name,
        phone: dto.phone,
        created_at: new Date(),
      };
      jest.spyOn(createPassengerUseCase, 'execute').mockResolvedValue(passenger);

      const result = await controller.create(dto);
      expect(result).toEqual(passenger);
      expect(createPassengerUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('findNearbyDrivers', () => {
    it('should return a list of nearby drivers for a passenger', async () => {
      const passengerId = '550e8400-e29b-41d4-a716-446655440003';
      const passenger: Passenger = {
        id: passengerId,
        name: 'Ana Martínez',
        phone: '1112223333',
        created_at: new Date(),
      };
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
      jest.spyOn(getPassengerUseCase, 'execute').mockResolvedValue(passenger);
      jest.spyOn(listNearbyDriversUseCase, 'execute').mockResolvedValue(drivers);

      const result = await controller.findNearbyDrivers(passengerId);
      expect(result).toEqual(drivers);
      expect(getPassengerUseCase.execute).toHaveBeenCalledWith(passengerId);
      expect(listNearbyDriversUseCase.execute).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should throw NotFoundException if passenger not found', async () => {
      const passengerId = '550e8400-e29b-41d4-a716-999999999999';
      jest.spyOn(getPassengerUseCase, 'execute').mockRejectedValue(
        new NotFoundException(`Passenger with ID ${passengerId} not found`),
      );

      await expect(controller.findNearbyDrivers(passengerId)).rejects.toThrow(NotFoundException);
    });
  });
});