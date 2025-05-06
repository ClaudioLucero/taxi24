import { MigrationInterface, QueryRunner } from 'typeorm';

// Migración para poblar la tabla de pasajeros con datos iniciales y revertir esos cambios si es necesario.
export class SeedPassengersTable1698765432104 implements MigrationInterface {
  // Inserta datos iniciales de pasajeros en la tabla 'passengers'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO passengers (id, name, phone, created_at)
      VALUES
        ('550e8400-e29b-41d4-a716-446655440003', 'Ana Martínez', '1112223333', NOW()),
        ('550e8400-e29b-41d4-a716-446655440004', 'Luis Fernández', '4445556666', NOW())
    `);
  }

  // Elimina los datos insertados en la tabla 'passengers' para revertir la migración
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM passengers WHERE id IN (
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440004'
      )
    `);
  }
}
