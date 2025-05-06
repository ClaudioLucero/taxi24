import { MigrationInterface, QueryRunner } from 'typeorm';

// Migración para poblar la tabla 'trips' con datos iniciales de ejemplo, insertando dos viajes con información como conductor, pasajero, ubicaciones, estado y costo.
export class SeedTripsTable1698765432106 implements MigrationInterface {
  // Inserta datos iniciales en la tabla 'trips' al ejecutar la migración
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO trips (id, driver_id, passenger_id, start_location, end_location, status, cost, created_at)
      VALUES
        ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', ST_SetSRID(ST_MakePoint(-74.0060, 40.7128), 4326), ST_SetSRID(ST_MakePoint(-74.0000, 40.7300), 4326), 'active', 15.50, NOW()),
        ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', ST_SetSRID(ST_MakePoint(-74.0050, 40.7130), 4326), ST_SetSRID(ST_MakePoint(-74.0100, 40.7200), 4326), 'completed', 20.00, NOW())
    `);
  }

  // Revierte la migración eliminando los datos insertados en la tabla 'trips'
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM trips WHERE id IN (
        '550e8400-e29b-41d4-a716-446655440005',
        '550e8400-e29b-41d4-a716-446655440006'
      )
    `);
  }
}
