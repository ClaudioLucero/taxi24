import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTripsTable1698765432105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS postgis;');
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('trips');
  }
}
