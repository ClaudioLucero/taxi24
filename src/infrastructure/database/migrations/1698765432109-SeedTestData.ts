import { MigrationInterface, QueryRunner } from 'typeorm';

// Migración para poblar la base de datos con datos de prueba, incluyendo pasajeros, conductores, viajes y facturas, para facilitar pruebas y desarrollo.
export class SeedTestData1698765432109 implements MigrationInterface {
  // Método que ejecuta la inserción de datos de prueba
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Limpia las tablas existentes para evitar duplicados
    await queryRunner.query(
      `TRUNCATE TABLE invoices RESTART IDENTITY CASCADE;`
    );
    await queryRunner.query(`TRUNCATE TABLE trips RESTART IDENTITY CASCADE;`);
    await queryRunner.query(`TRUNCATE TABLE drivers RESTART IDENTITY CASCADE;`);
    await queryRunner.query(
      `TRUNCATE TABLE passengers RESTART IDENTITY CASCADE;`
    );

    // Inserta datos de prueba para pasajeros
    await queryRunner.query(`
      INSERT INTO passengers (id, name, phone, created_at)
      VALUES
        ('550e8400-e29b-41d4-a716-446655440003', 'Ana Martínez', '1112223333', NOW()),
        ('550e8400-e29b-41d4-a716-446655440004', 'Luis Fernández', '4445556666', NOW()),
        ('550e8400-e29b-41d4-a716-446655440005', 'Sofía Ramírez', '7778889999', NOW())
    `);

    // Inserta datos de prueba para conductores con ubicaciones geográficas
    await queryRunner.query(`
      INSERT INTO drivers (id, name, phone, location, status, created_at)
      VALUES
        ('550e8400-e29b-41d4-a716-446655440000', 'Juan Pérez', '1234567890', ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326), 'available', NOW()),
        ('550e8400-e29b-41d4-a716-446655440001', 'María Gómez', '0987654321', ST_SetSRID(ST_MakePoint(-74.005, 40.713), 4326), 'available', NOW()),
        ('550e8400-e29b-41d4-a716-446655440002', 'Carlos López', '5556667777', ST_SetSRID(ST_MakePoint(-74.007, 40.714), 4326), 'busy', NOW())
    `);

    // Inserta datos de prueba para viajes, asociando conductores y pasajeros
    await queryRunner.query(`
      INSERT INTO trips (id, driver_id, passenger_id, start_location, end_location, status, cost, created_at, completed_at)
      VALUES
        ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326), ST_SetSRID(ST_MakePoint(-74.0, 40.73), 4326), 'active', 15.50, NOW(), NULL),
        ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', ST_SetSRID(ST_MakePoint(-74.005, 40.713), 4326), ST_SetSRID(ST_MakePoint(-74.01, 40.72), 4326), 'completed', 20.00, NOW(), NOW())
    `);

    // Inserta datos de prueba para facturas, asociadas a un viaje
    await queryRunner.query(`
      INSERT INTO invoices (id, trip_id, amount, created_at)
      VALUES
        ('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440006', 20.00, NOW())
    `);
  }

  // Método que revierte la migración eliminando todos los datos insertados
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Limpia todas las tablas para deshacer los cambios
    await queryRunner.query(
      `TRUNCATE TABLE invoices RESTART IDENTITY CASCADE;`
    );
    await queryRunner.query(`TRUNCATE TABLE trips RESTART IDENTITY CASCADE;`);
    await queryRunner.query(`TRUNCATE TABLE drivers RESTART IDENTITY CASCADE;`);
    await queryRunner.query(
      `TRUNCATE TABLE passengers RESTART IDENTITY CASCADE;`
    );
  }
}
