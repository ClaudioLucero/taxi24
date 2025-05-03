import { Test, TestingModule } from '@nestjs/testing';
import { PassengersController } from '../../../infrastructure/controllers/passengers.controller';
import { ListPassengersUseCase } from '../../../application/use-cases/passengers/list-passengers.use-case';
import { GetPassengerUseCase } from '../../../application/use-cases/passengers/get-passenger.use-case';
import { CreatePassengerUseCase } from '../../../application/use-cases/passengers/create-passenger.use-case';
import { Passenger } from '../../../domain/entities/passenger.entity';
import { NotFoundException } from '@nestjs/common';

describe('PassengersController', () => {
  let controller: PassengersController;
  let listPassengersUseCase: ListPassengersUseCase;
  let getPassengerUseCase: GetPassengerUseCase;
  let createPassengerUseCase: CreatePassengerUseCase;

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
      ],
    }).compile();

    controller = module.get<PassengersController>(PassengersController);
    listPassengersUseCase = module.get<ListPassengersUseCase>(ListPassengersUseCase);
    getPassengerUseCase = module.get<GetPassengerUseCase>(GetPassengerUseCase);
    createPassengerUseCase = module.get<CreatePassengerUseCase>(CreatePassengerUseCase);
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
      jest.spyOn(getPassengerUseCase, 'execute').mockRejectedValue(new NotFoundException());

      await expect(controller.findById('invalid-id')).rejects.toThrow(NotFoundException);
      expect(getPassengerUseCase.execute).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('create', () => {
    it('should create a new passenger', async () => {
      const dto = { name: 'Sofía Ramírez', phone: '7778889999' };
      const passenger: Passenger = {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Sofía Ramírez',
        phone: '7778889999',
        created_at: new Date(),
      };
      jest.spyOn(createPassengerUseCase, 'execute').mockResolvedValue(passenger);

      const result = await controller.create(dto);
      expect(result).toEqual(passenger);
      expect(createPassengerUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });
});