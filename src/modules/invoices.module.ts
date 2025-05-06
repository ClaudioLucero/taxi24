import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from '../domain/entities/invoice.entity';
import { InvoicesController } from '../infrastructure/controllers/invoices.controller';
import { InvoiceRepository } from '../infrastructure/repositories/invoice.repository';
import { CreateInvoiceUseCase } from '../application/use-cases/invoices/create-invoice.use-case';
import { ListInvoicesUseCase } from '../application/use-cases/invoices/list-invoices.use-case';
import { TripsModule } from './trips.module';

// Módulo para gestionar facturas, organizando controladores, repositorios y casos de uso relacionados con la creación y listado de facturas
@Module({
  // Configura las dependencias del módulo
  imports: [
    // Habilita el uso de la entidad Invoice con TypeORM para operaciones en la base de datos
    TypeOrmModule.forFeature([Invoice]),
    // Usa forwardRef para manejar la dependencia circular con TripsModule
    forwardRef(() => TripsModule),
  ],
  // Define el controlador para manejar solicitudes HTTP de facturas
  controllers: [InvoicesController],
  // Registra los servicios para la lógica de negocio y acceso a datos
  providers: [
    // Repositorio para operaciones de base de datos con facturas
    InvoiceRepository,
    // Casos de uso para crear y listar facturas
    CreateInvoiceUseCase,
    ListInvoicesUseCase,
  ],
  // Comparte el repositorio con otros módulos
  exports: [InvoiceRepository],
})
// Clase que representa el módulo de facturas
export class InvoicesModule {}
