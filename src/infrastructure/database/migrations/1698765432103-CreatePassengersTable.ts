import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// Migración para crear la tabla 'passengers' en la base de datos, definiendo columnas para ID, nombre, teléfono y fecha de creación.
export class CreatePassengersTable1698765432103 implements MigrationInterface {
  // Crea la tabla 'passengers' con sus columnas cuando se ejecuta la migración
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'passengers',
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
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    );
  }

  // Elimina la tabla 'passengers' si se revierte la migración
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('passengers');
  }
}
