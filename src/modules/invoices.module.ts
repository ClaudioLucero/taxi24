import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from '../domain/entities/invoice.entity';
import { InvoicesController } from '../infrastructure/controllers/invoices.controller';
import { InvoiceRepository } from '../infrastructure/repositories/invoice.repository';
import { CreateInvoiceUseCase } from '../application/use-cases/invoices/create-invoice.use-case';
import { ListInvoicesUseCase } from '../application/use-cases/invoices/list-invoices.use-case';
import { TripsModule } from './trips.module';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice]), forwardRef(() => TripsModule)],
  controllers: [InvoicesController],
  providers: [
    InvoiceRepository,
    CreateInvoiceUseCase,
    ListInvoicesUseCase,
  ],
  exports: [InvoiceRepository],
})
export class InvoicesModule {}