import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// Migración para crear la tabla 'trips' en la base de datos, que almacena información de viajes, incluyendo ubicación, conductor, pasajero, costo y estado.
export class CreateTripsTable1698765432105 implements MigrationInterface {
  // Método que ejecuta la creación de la tabla 'trips' al aplicar la migración
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilita la extensión PostGIS para soporte de datos geoespaciales
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    // Crea la tabla 'trips' con columnas para ID, conductor, pasajero, ubicaciones, estado, costo y fechas
    await queryRunner.createTable(
      new Table({
        name: 'trips',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'driver_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'passenger_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'start_location',
            type: 'geometry',
            srid: 4326,
            isNullable: true,
          },
          {
            name: 'end_location',
            type: 'geometry',
            srid: 4326,
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'active'",
          },
          {
            name: 'cost',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'completed_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        // Define claves foráneas para relacionar con las tablas de conductores y pasajeros
        foreignKeys: [
          {
            columnNames: ['driver_id'],
            referencedTableName: 'drivers',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['passenger_id'],
            referencedTableName: 'passengers',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
        // Crea un índice espacial para optimizar consultas geoespaciales en la columna start_location
        indices: [
          {
            name: 'idx_trips_start_location',
            columnNames: ['start_location'],
            isSpatial: true,
          },
        ],
      }),
      true
    );
  }

  // Método que elimina la tabla 'trips' al revertir la migración
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('trips');
  }
}
