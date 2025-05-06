import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// Migración para crear la tabla 'invoices' en la base de datos, definiendo columnas, claves foráneas e índices para gestionar facturas asociadas a viajes.
export class CreateInvoicesTable1698765432107 implements MigrationInterface {
  // Crea la tabla 'invoices' con su estructura definida
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'trip_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          // Define una clave foránea que relaciona 'trip_id' con la tabla 'trips'
          {
            columnNames: ['trip_id'],
            referencedTableName: 'trips',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          // Crea un índice para optimizar búsquedas por 'trip_id'
          {
            name: 'idx_invoice_trip_id',
            columnNames: ['trip_id'],
          },
        ],
      }),
      true
    );
  }

  // Elimina la tabla 'invoices' si se revierte la migración
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoices');
  }
}
