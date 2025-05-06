import { MigrationInterface, QueryRunner } from 'typeorm';

// Migración para poblar la tabla de conductores con datos iniciales, insertando tres registros de ejemplo para pruebas o desarrollo.
export class SeedDriversTable1698765432101 implements MigrationInterface {
  // Inserta datos iniciales en la tabla de conductores
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO drivers (id, name, phone, location, status, created_at)
      VALUES
        ('550e8400-e29b-41d4-a716-446655440000', 'Juan Pérez', '1234567890', ST_GeomFromText('POINT(-74.0060 40.7128)', 4326), 'available', NOW()),
        ('550e8400-e29b-41d4-a716-446655440001', 'María Gómez', '0987654321', ST_GeomFromText('POINT(-74.0050 40.7130)', 4326), 'available', NOW()),
        ('550e8400-e29b-41d4-a716-446655440002', 'Carlos López', '5555555555', ST_GeomFromText('POINT(-74.0070 40.7110)', 4326), 'busy', NOW())
    `);
  }

  // Revierte la migración eliminando los datos insertados
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM drivers WHERE id IN (
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002'
      )
    `);
  }
}
