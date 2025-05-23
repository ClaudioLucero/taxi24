// src/infrastructure/repositories/invoice.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../../domain/entities/invoice.entity';
import { CreateInvoiceDto, InvoiceFiltersDto } from '../dtos/invoice.dto';
import { TripRepository } from './trip.repository';

// Repositorio para gestionar operaciones de base de datos relacionadas con facturas, como crear, buscar por ID o filtrar por criterios como pasajero, conductor o fechas.
@Injectable()
export class InvoiceRepository {
  constructor(
    @InjectRepository(Invoice)
    private readonly repository: Repository<Invoice>,
    private readonly tripRepository: TripRepository
  ) {}

  async findAll(
    filters: InvoiceFiltersDto
  ): Promise<{ items: Invoice[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    const {
      passengerId,
      driverId,
      startDate,
      endDate,
      page = 1,
      limit = 100,
    } = filters;
    const query = this.repository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.trip', 'trip')
      .leftJoinAndSelect('trip.passenger', 'passenger')
      .leftJoinAndSelect('trip.driver', 'driver');

    if (passengerId) {
      query.andWhere('trip.passenger_id = :passengerId', { passengerId });
    }
    if (driverId) {
      query.andWhere('trip.driver_id = :driverId', { driverId });
    }
    if (startDate) {
      query.andWhere('invoice.created_at >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('invoice.created_at <= :endDate', { endDate });
    }

    query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('invoice.created_at', 'DESC')
      .cache(false);

    const [items, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findById(id: string): Promise<Invoice | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['trip', 'trip.passenger', 'trip.driver'],
    });
  }

  async findByTripId(tripId: string): Promise<Invoice | null> {
    return this.repository.findOne({
      where: { trip_id: tripId },
      relations: ['trip', 'trip.passenger', 'trip.driver'],
    });
  }

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const trip = await this.tripRepository.findById(dto.trip_id);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${dto.trip_id} not found`);
    }

    const invoice = this.repository.create(dto);
    return this.repository.save(invoice);
  }
}