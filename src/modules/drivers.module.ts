import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from '../domain/entities/driver.entity';
import { DriversController } from '../infrastructure/controllers/drivers.controller';
import { DriverRepository } from '../infrastructure/repositories/driver.repository';
import { ListDriversUseCase } from '../application/use-cases/drivers/list-drivers.use-case';
import { ListAvailableDriversUseCase } from '../application/use-cases/drivers/list-available-drivers.use-case';
import { ListNearbyDriversUseCase } from '../application/use-cases/drivers/list-nearby-drivers.use-case';

// Módulo para gestionar funcionalidades relacionadas con conductores, organizando controladores, servicios y acceso a datos
@Module({
  // Configura las dependencias necesarias para el módulo
  imports: [
    // Habilita el uso de la entidad Driver con TypeORM para operaciones en la base de datos
    TypeOrmModule.forFeature([Driver]),
  ],
  // Define el controlador que maneja las solicitudes HTTP para conductores
  controllers: [DriversController],
  // Registra servicios y casos de uso para la lógica de negocio y acceso a datos
  providers: [
    // Repositorio para operaciones de base de datos de conductores
    DriverRepository,
    // Casos de uso para listar conductores, conductores disponibles y conductores cercanos
    ListDriversUseCase,
    ListAvailableDriversUseCase,
    ListNearbyDriversUseCase,
  ],
  // Comparte componentes con otros módulos de la aplicación
  exports: [
    // Permite que otros módulos usen el repositorio y el caso de uso para conductores cercanos
    DriverRepository,
    ListNearbyDriversUseCase,
  ],
})
// Clase que representa el módulo de conductores
export class DriversModule {}
