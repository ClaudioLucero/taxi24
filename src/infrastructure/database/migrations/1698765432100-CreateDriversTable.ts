import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// Migración para crear la tabla 'drivers' en la base de datos, definiendo los campos para almacenar información de conductores, como ID, nombre, teléfono, ubicación y estado.
export class CreateDriversTable1698765432100 implements MigrationInterface {
  // Crea la tabla 'drivers' con las columnas especificadas
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'drivers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'geometry',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'available'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    );
  }

  // Elimina la tabla 'drivers' si es necesario revertir la migración
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('drivers');
  }
}
